const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const AdmZip = require("adm-zip");


// Models
const TRP = require("../models/trpModel");
const Metadata = require("../models/metadataModel");
// const Route = require("../models/routeModel");
const Event = require("../models/eventModel");
const Metrics = require("../models/metricsModel");
const Log = require("../models/logModel");
const RoutePoint = require('../models/RoutePoint');
const debug = require('debug')('app:rtpParser'); // Namespace for debugging
/**
 * Processes a TRP file by extracting it, parsing the XML data, and saving the information to the database.
 * @param {string} filePath - The path to the TRP file to be processed.
 * @param {string} fileName - The name of the TRP file.
 * @returns {Promise<Object>} - The saved TRP record from the database, including associated route points.
 */
exports.parseAndSaveTRP = async (filePath, fileName) => {
    const extractedPath = path.join(__dirname, "../uploads/extracted");
    const trpFolderPath = path.join(extractedPath, "trp");

    try {
        // Validate the file and create necessary directories
        validateFile(filePath);
        createDirectory(extractedPath);


        debug(`folder's creating before unzip information`,filePath, extractedPath);

        // Extract the .trp file
        await extractFile(filePath, extractedPath);

        // Validate that the 'trp' folder and required files exist
        validateExtractedContent(trpFolderPath, ["content.xml", "route.xml", "positions/wptrack.xml"]);

        // Read and parse the XML files
        const [contentData, routeData, routePositions] = await parseXMLFiles(trpFolderPath, ["content.xml", "route.xml", "positions/wptrack.xml"]);

        // Process and save the data to the database
        const trpRecord = await saveToDatabase(fileName, contentData, routePositions, trpFolderPath);

        // Retrieve the associated routePoints and add them to the trpRecord
        const routePoints = await RoutePoint.find({ routeId: trpRecord._id });
        trpRecord.routePoints = routePoints;

        console.log(`File ${fileName} processed and saved successfully.`);
        return trpRecord;

    } catch (error) {
        console.error(`Error processing file ${fileName}:`, error.message);
        throw error;
    }
};

// ----------------------- Helper Functions -----------------------

/**
 * Validates that the file exists at the specified path.
 * @param {string} filePath - The path to the file to validate.
 * @throws {Error} - If the file does not exist.
 */
function validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
}

/**
 * Creates a directory if it does not already exist.
 * @param {string} dirPath - The path of the directory to create.
 */
function createDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Extracts a .trp file using the adm-zip library.
 * @param {string} filePath - The path to the .trp file to extract.
 * @param {string} extractDir - The directory where the files will be extracted.
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs during extraction.
 */
async function extractFile(filePath, extractDir) {
    try {
        // Initialize adm-zip with the .trp file
        const zip = new AdmZip(filePath);
        const zipEntries = zip.getEntries();

        // Create the extraction directory if it does not exist
        if (!fs.existsSync(extractDir)) {
            fs.mkdirSync(extractDir, { recursive: true });
        }

        // Iterate over the ZIP entries and extract them
        zipEntries.forEach((zipEntry) => {
            const entryPath = path.join(extractDir, zipEntry.entryName);

            if (zipEntry.isDirectory) {
                // Create the directory if it does not exist
                if (!fs.existsSync(entryPath)) {
                    fs.mkdirSync(entryPath, { recursive: true });
                }
            } else {
                // Extract the file and save it to the file system
                const data = zipEntry.getData();
                fs.writeFileSync(entryPath, data);
                console.log(`Extracted file: ${entryPath}`);
            }
        });

        console.log("Extraction completed successfully.");
    } catch (error) {
        console.error("Error during extraction:", error.message);
        throw new Error("Failed to extract the .trp file.");
    }
}

/**
 * Validates that the required files exist in the extracted 'trp' folder.
 * @param {string} trpFolderPath - The path to the extracted 'trp' folder.
 * @param {string[]} requiredFiles - An array of required file names.
 * @throws {Error} - If the 'trp' folder does not exist or if any required files are missing.
 */
function validateExtractedContent(trpFolderPath, requiredFiles) {
    if (!fs.existsSync(trpFolderPath)) {
        throw new Error(`"trp" folder not found at: ${trpFolderPath}`);
    }

    const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(trpFolderPath, file)));
    if (missingFiles.length > 0) {
        throw new Error(`Missing files: ${missingFiles.join(", ")}`);
    }
}

/**
 * Reads and parses XML files from a specified folder.
 * @param {string} folderPath - The path to the folder containing the XML files.
 * @param {string[]} fileNames - An array of XML file names to read and parse.
 * @returns {Promise<Object[]>} - An array of parsed objects from the XML files.
 * @throws {Error} - If an error occurs while reading or parsing the XML files.
 */
async function parseXMLFiles(folderPath, fileNames) {
    try {
        return await Promise.all(
            fileNames.map(async (fileName) => {
                const filePath = path.join(folderPath, fileName);
                const fileContent = fs.readFileSync(filePath, "utf-8");
                return await xml2js.parseStringPromise(fileContent);
            })
        );
    } catch (error) {
        console.error("Error reading or parsing XML files:", error.message);
        throw new Error("Failed to process the XML files.");
    }
}

/**
 * Saves the parsed data to the database.
 * @param {string} fileName - The name of the TRP file.
 * @param {Object} contentData - The parsed data from content.xml.
 * @param {Object} routeData - The parsed data from route.xml.
 * @param {string} trpFolderPath - The path to the extracted 'trp' folder.
 * @returns {Promise<Object>} - The saved TRP record from the database.
 */
async function saveToDatabase(fileName, contentData, routeData, trpFolderPath) {
    const events = contentData.events?.[0]?.event || [];
    const routes = routeData.gpx?.trk[0]?.trkseg[0]?.trkpt || [];
    const metadata = contentData.metadata?.[0];
    const metrics = contentData.metrics?.[0]?.metric || [];

    // Create and save the main TRP record
    const trpRecord = new TRP({
        fileName,
        totalRoutes: routes.length,
        totalEvents: events.length,
    });
    await trpRecord.save();

    // Save related data
    await saveMetadata(trpRecord._id, metadata);
    await saveRoutes(trpRecord._id, routes);
    await saveEvents(trpRecord._id, events);
    await saveMetrics(trpRecord._id, metrics);
    await saveLogs(trpRecord._id, trpFolderPath);

    return trpRecord;
}

/**
 * Saves metadata to the database.
 * @param {string} trpId - The ID of the TRP record to associate with the metadata.
 * @param {Object} metadata - The parsed metadata object.
 * @returns {Promise<void>}
 */
async function saveMetadata(trpId, metadata) {
    if (!metadata) return;
    const metadataRecord = new Metadata({
        trpId,
        startTime: metadata.startTime?.[0],
        stopTime: metadata.stopTime?.[0],
        status: metadata.status?.[0],
        userName: metadata.creator?.[0]?.userName?.[0],
        isAdmin: metadata.creator?.[0]?.isAdmin?.[0] === "true",
    });
    await metadataRecord.save();
}

/**
 * Saves routes to the database.
 * @param {string} trpId - The ID of the TRP record to associate with the routes.
 * @param {Object[]} routes - An array of parsed route objects.
 * @returns {Promise<void>}
 */
async function saveRoutes(trpId, routes) {
    for (const route of routes) {
        /*
        // Commented out code for saving routes with images
        const coordinates = route.coordinates?.[0];
        const distance = route.distance?.[0];
        const routeRecord = new Route({
            trpId,
            coordinates,
            distance,
            imagePath: await generateRouteImage(coordinates),
        });
        await routeRecord.save();
        */

        // Save route points
        const routePoint = new RoutePoint({
            routeId: trpId,
            latitude: parseFloat(route.$.lat),
            longitude: parseFloat(route.$.lon),
            timestamp: new Date(route.time[0]),
            details: route.name ? route.name[0] : '',
            // imagePath: await generateRouteImage(coordinates),
        });
        await routePoint.save();
    }
}

/**
 * Saves events to the database.
 * @param {string} trpId - The ID of the TRP record to associate with the events.
 * @param {Object[]} events - An array of parsed event objects.
 * @returns {Promise<void>}
 */
async function saveEvents(trpId, events) {
    for (const event of events) {
        const eventRecord = new Event({
            trpId,
            eventType: event.type?.[0],
            timestamp: event.timestamp?.[0],
            description: event.description?.[0],
        });
        await eventRecord.save();
    }
}

/**
 * Saves metrics to the database.
 * @param {string} trpId - The ID of the TRP record to associate with the metrics.
 * @param {Object[]} metrics - An array of parsed metric objects.
 * @returns {Promise<void>}
 */
async function saveMetrics(trpId, metrics) {
    for (const metric of metrics) {
        const metricsRecord = new Metrics({
            trpId,
            rsrp: metric.rsrp?.[0],
            sinr: metric.sinr?.[0],
            throughput: metric.throughput?.[0],
            timestamp: metric.timestamp?.[0],
        });
        await metricsRecord.save();
    }
}

/**
 * Saves logs to the database.
 * @param {string} trpId - The ID of the TRP record to associate with the logs.
 * @param {string} trpFolderPath - The path to the extracted 'trp' folder.
 * @returns {Promise<void>}
 */
async function saveLogs(trpId, trpFolderPath) {
    const logsPath = path.join(trpFolderPath, "logs");
    if (fs.existsSync(logsPath) && fs.lstatSync(logsPath).isDirectory()) {
        const logFiles = fs.readdirSync(logsPath);
        for (const logFile of logFiles) {
            const logContent = fs.readFileSync(path.join(logsPath, logFile), "utf-8");
            const logRecord = new Log({ trpId, content: logContent });
            await logRecord.save();
        }
    }
}
