const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

/**
 * Generates a route image using the Google Maps Static API.
 * @param {Array<Object>} routePoints - An array of route points, each containing latitude and longitude.
 * @returns {Promise<string>} - The file path of the generated map image.
 * @throws {Error} - If the image generation fails.
 */
async function generateRouteImageForAllPoints(routePoints) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const generatedPath = path.join(__dirname, "../generated");
    
    // Ensure the generated directory exists
    fs.mkdirSync(generatedPath, { recursive: true });

    // Check if routePoints are provided
    if (!routePoints || routePoints.length === 0) {
        console.warn("No route points provided for image generation.");
        return path.join(generatedPath, "no_coordinates.png");
    }

    // Build the markers for the map
    const markers = buildMarkers(routePoints);

    // Determine the center of the map using the first route point
    const center = `${routePoints[0].latitude},${routePoints[0].longitude}`;

    const filePath = path.join(generatedPath, `route_points_map.png`);
    const url = `https://maps.googleapis.com/maps/api/staticmap?size=800x600&maptype=roadmap&zoom=16&center=${center}&markers=color:red%7C${markers}&key=${apiKey}`;

    try {
        // Make a GET request to the Google Maps Static API
        const response = await axios.get(url, { responseType: "arraybuffer" });
        
        // Write the image data to the file system
        fs.writeFileSync(filePath, response.data);
        console.log("Image generated successfully:", filePath);
        return filePath;
    } catch (error) {
        if (error.response) {
            // Save the error response for diagnostics
            const errorFilePath = path.join(generatedPath, "error_response.html");
            fs.writeFileSync(errorFilePath, error.response.data);
            console.error("Error response saved to:", errorFilePath);
        }

        console.error("Error generating route image for all points:", error.message);
        throw new Error("Failed to generate the map image with all points.");
    }
}

/**
 * Constructs the markers parameter for the Google Maps Static API.
 * @param {Array<Object>} routePoints - An array of route points, each containing latitude and longitude.
 * @returns {string} - A formatted string of markers for the API request.
 */
function buildMarkers(routePoints) {
    return routePoints
        .map(point => `${point.latitude},${point.longitude}`)
        .filter(coord => coord) // Removes empty entries
        .join("%7C"); // Joins the points with '%7C'
}

/**
 * Generates a PowerPoint presentation based on the trpRecord data.
 * @param {Object} trpRecord - The TRP record containing metadata and route points.
 * @param {string} fileName - The name of the TRP file.
 * @returns {Promise<string>} - The file path of the generated PPTX file.
 * @throws {Error} - If the PPTX generation fails.
 */
exports.generatePPTX = async (trpRecord, fileName) => {
    try {
        const pptx = new pptxgen();

        // Add a slide with the presentation title
        pptx.addSlide().addText(`Report for ${fileName}`, {
            x: 1,
            y: 1,
            fontSize: 24,
            bold: true,
            color: "363636",
        });

        // Add a slide for metadata
        const metadataSlide = pptx.addSlide();
        metadataSlide.addText("Metadata", { x: 0.5, y: 0.5, fontSize: 18, bold: true });
        metadataSlide.addText(`User: ${trpRecord.userName || "N/A"}`, { x: 0.5, y: 1 });
        metadataSlide.addText(`Start Time: ${trpRecord.startTime || "N/A"}`, { x: 0.5, y: 1.5 });
        metadataSlide.addText(`End Time: ${trpRecord.stopTime || "N/A"}`, { x: 0.5, y: 2 });

        // Example route points (replace with trpRecord.routePoints as needed)
        const routePoints = [
            { latitude: 37.7749, longitude: -122.4194 },
            { latitude: 34.0522, longitude: -118.2437 },
            { latitude: 40.7128, longitude: -74.0060 },
        ];

        // Generate an image with all route points
        const routeImagePath = await generateRouteImageForAllPoints(routePoints); // Replace with trpRecord.routePoints

        // Add a slide with the route map image
        const routeSlide = pptx.addSlide();
        routeSlide.addText("Route Map", { x: 0.5, y: 0.5, fontSize: 18, bold: true });
        routeSlide.addImage({
            path: routeImagePath,
            x: 1,
            y: 1,
            w: 8,
            h: 6,
        });

        // Ensure the output directory exists
        const outputDir = path.join(__dirname, "../uploads/pptx");
        fs.mkdirSync(outputDir, { recursive: true });

        // Define the PPTX file path
        const pptxPath = path.join(outputDir, `${fileName.replace(".trp", "")}.pptx`);
        
        // Write the PPTX file to the file system
        await pptx.writeFile({ fileName: pptxPath });

        console.log(`PPTX file generated at: ${pptxPath}`);
        return pptxPath;
    } catch (error) {
        console.error("Error generating the PPTX file:", error.message);
        throw error;
    }
};
