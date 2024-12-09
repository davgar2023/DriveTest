// Import necessary services and modules
const { parseAndSaveTRP } = require("../services/trpParser"); // Service to parse and save TRP data
const { generatePPTX } = require("../services/pptxService"); // Service to generate PowerPoint presentations
const path = require("path"); // Node.js module to handle file paths
const fs = require("fs"); // Node.js module to interact with the file system
const debug = require('debug')('app:rtpFile'); // Namespace for debugging

/**
 * Controller to process the uploaded TRP file.
 * This function handles file uploads, processes the data, generates a PowerPoint report,
 * and responds with a download URL for the generated report.
 * 
 * @param {Object} req - Express request object containing the uploaded file
 * @param {Object} res - Express response object used to send responses back to the client
 */
exports.processTRP = async (req, res) => {

    
   
    const file = req.files?.file;//req.file;

    debug('verify upload file ->',  file); // Debug response

    if (!file) return res.status(400).send("No file uploaded.");

    const folder = path.join(__dirname, "../uploads");

    await createDirectory(folder);

    // Define the path where the uploaded file will be saved on the server
    const filePath = path.join(folder, file.name);
    
   // await createDirectory(filePath);

    try {
        
        debug(' file path ->',  filePath); // Debug response
        await file.mv(filePath);

        debug(' file->',  file.name); // Debug response


        // Parse the TRP file and save its data to the database or appropriate storage
        // 'parseAndSaveTRP' is an asynchronous function that returns a TRP record
        const trpRecord = await parseAndSaveTRP(filePath, file.name);

        // Generate a PowerPoint presentation based on the parsed TRP data
        // 'generatePPTX' is an asynchronous function that returns the path to the generated PPTX file
        const pptxPath = await generatePPTX(trpRecord, file.name);

        // Respond to the client with a success message and the download URL for the generated report
        res.status(200).json({
            message: "Report generated successfully",
            downloadUrl: `/api/reports/download/${path.basename(pptxPath)}`, // URL to download the PPTX report
        });
    } catch (error) {
        // If any error occurs during the process, respond with a 500 Internal Server Error status
        // and include the error message for debugging purposes
        res.status(500).send(`Error processing file: ${error.message}`);
        debug(`Error processing file: ${error.message}`); // Debug response
    }
};

/**
 * Controller to handle the download of the generated PowerPoint report.
 * This function verifies the existence of the requested file and sends it to the client for download.
 * 
 * @param {Object} req - Express request object containing the filename parameter
 * @param {Object} res - Express response object used to send the file back to the client
 */
exports.downloadReport = (req, res) => {
    // Extract the filename from the route parameters
    const fileName = req.params.fileName; // e.g., /download/report.pptx

    // Define the full path to the PPTX file on the server
    const filePath = path.join(__dirname, "../uploads/pptx", fileName); // e.g., ../uploads/pptx/report.pptx

    // Check if the requested file exists in the specified directory
    if (!fs.existsSync(filePath)) {
        // If the file does not exist, respond with a 404 Not Found status and an error message
        return res.status(404).send("File not found.");
    }

    // Send the file to the client as a downloadable attachment
    res.download(filePath, (err) => {
        if (err) {
            // If an error occurs while sending the file, log the error and respond with a 500 status
            console.error("Error downloading file:", err.message);
            res.status(500).send("Error downloading the file.");
        }
    });
};

/**
 * Creates a directory if it does not already exist.
 * @param {string} dirPath - The path of the directory to create.
 */
function createDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * API Endpoint: Get a list of all .pptx files in the uploads directory.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllPPTXFiles = (req, res) => {
    // Define the directory where the .pptx files are stored
    const pptxDirectory = path.join(__dirname, "../uploads/pptx");

    // Ensure the directory exists
    if (!fs.existsSync(pptxDirectory)) {
        return res.status(404).send("PPTX directory not found.");
    }

    try {
        // Read the directory and filter for .pptx files
        const files = fs.readdirSync(pptxDirectory).filter(file => file.endsWith(".pptx"));

         // Collect file details (size and creation date)
         const fileDetails = files.map(file => {
            const filePath = path.join(pptxDirectory, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                size: `${(stats.size / 1024).toFixed(2)} KB`, // File size in KB
                createdAt: stats.birthtime, // Creation date
            };
        });


        // Respond with the list of .pptx files
        res.status(200).json({
            message: "List of .pptx files retrieved successfully",
            files: fileDetails,
        });
    } catch (error) {
        console.error("Error reading .pptx directory:", error.message);
        res.status(500).send("Error retrieving .pptx files.");
    }
};