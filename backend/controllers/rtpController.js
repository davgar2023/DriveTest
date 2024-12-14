// Import necessary services and modules
const { parseAndSaveTRP } = require("../services/trpParser"); // Service to parse and save TRP data
const { generatePPTX } = require("../services/pptxService"); // Service to generate PowerPoint presentations
const path = require("path"); // Node.js module to handle file paths
const fs = require("fs"); // Node.js module to interact with the file system
const debug = require('debug')('app:rtpFile'); // Namespace for debugging

/**
 * Controller to process the uploaded TRP file.
 * Handles file uploads, processes the data, generates a PowerPoint report,
 * and responds with a download URL for the generated report.
 * 
 * @param {Object} req - Express request object containing the uploaded file in `req.file`.
 * @param {Object} res - Express response object used to send responses back to the client.
 */
exports.processTRP = async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).send({message: 'No file uploaded.'});
        }

        // Path to the uploaded file
        const filePath = req.file.path;
        const fileName = req.file.filename;

        // Debugging information
        debug('Uploaded file details:', req.file);

        // Parse the TRP file and save its data
        const trpRecord = await parseAndSaveTRP(filePath, fileName);

        // Generate a PowerPoint presentation based on the parsed TRP data
        const pptxPath = await generatePPTX(trpRecord, fileName);

        // Respond with a success message and the download URL
        res.status(200).json({
            message: "Report generated successfully",
            downloadUrl: `/api/reports/download/${path.basename(pptxPath)}`,
        });
    } catch (error) {
        // Handle errors and send appropriate responses
        res.status(500).send(`Error processing file: ${error.message}`);
        debug(`Error processing file: ${error.message}`);
    }
};

/**
 * Controller to handle the download of the generated PowerPoint report.
 * Verifies the existence of the requested file and sends it to the client for download.
 * 
 * @param {Object} req - Express request object containing the filename parameter in `req.params.fileName`.
 * @param {Object} res - Express response object used to send the file back to the client.
 */
exports.downloadReport = (req, res) => {
    // Extract the filename from the request parameters
    const fileName = req.params.fileName;

    // Define the full path to the requested file
    const filePath = path.join(__dirname, "../uploads/pptx", fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send({message: "File not found."});
    }

    // Send the file to the client as a downloadable attachment
    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading file:", err.message);
            res.status(500).send({message: "Error downloading the file."});
        }
    });
};

/**
 * API Endpoint: Get a list of all .pptx files in the uploads directory.
 * Retrieves the file names, sizes, and creation dates.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to send the list of files.
 */
exports.getAllPPTXFiles = (req, res) => {
    // Define the directory containing the .pptx files
    const pptxDirectory = path.join(__dirname, "../uploads/pptx");

    // Check if the directory exists
    if (!fs.existsSync(pptxDirectory)) {
        return res.status(404).send("PPTX directory not found.");
    }

    try {
        // Read the directory and filter for .pptx files
        const files = fs.readdirSync(pptxDirectory).filter(file => file.endsWith(".pptx"));

        // Map file details including name, size, and creation date
        const fileDetails = files.map(file => {
            const filePath = path.join(pptxDirectory, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                size: `${(stats.size / 1024).toFixed(2)} KB`, // File size in KB
                createdAt: stats.birthtime, // Creation date
            };
        });

        // Respond with the list of files
        res.status(200).json({
            message: "List of .pptx files retrieved successfully",
            files: fileDetails,
        });
    } catch (error) {
        console.error("Error reading .pptx directory:", error.message);
        res.status(500).send("Error retrieving .pptx files.");
    }
};
