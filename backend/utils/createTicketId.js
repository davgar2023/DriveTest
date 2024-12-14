// Import the Report model (assuming you're using Mongoose for MongoDB)
const Report = require('../models/Report');

/**
 * Generates a unique ticketed code based on the current date and a sequential number.
 * The format of the code is YYYYMMDDXXXX, where:
 * - YYYY: 4-digit year
 * - MM: 2-digit month
 * - DD: 2-digit day
 * - XXXX: 4-digit sequence number (zero-padded)
 * 
 * @returns {Promise<string>} - The newly generated ticketed code.
 */
async function generateTicketedCode() {
    // Get the current date and extract year, month, and day
    const now = new Date();
    const year = now.getFullYear(); // e.g., 2024
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JS
    const day = String(now.getDate()).padStart(2, '0'); // e.g., '11' for the 11th day

    // Create a prefix based on the current date, e.g., "20241211"
    const codePrefix = `${year}${month}${day}`;

    // Define a regular expression to find codes that start with today's prefix
    const regex = new RegExp(`^${codePrefix}`);

    // Query the database to find the latest report with today's prefix
    // Sort by ticketedCode in descending order to get the latest one
    const lastReport = await Report.findOne(
        { ticketedId: regex }, // Filter: ticketedCode starts with codePrefix
        {}, // Projection: return all fields (can be adjusted if needed)
        { sort: { ticketedId: -1 } } // Sort: descending order
    );

    let sequence = 0; // Initialize sequence number

    if (lastReport && lastReport.ticketedId) {
        // Calculate the length of the prefix to extract the sequence part
        const prefixLength = codePrefix.length;

        // Extract the sequence part from the last ticketed code
        const suffix = lastReport.ticketedId.substring(prefixLength); // e.g., '0001'

        // Parse the sequence number as an integer
        const numberPart = parseInt(suffix, 10);

        // If parsing is successful and results in a valid number, set it as the current sequence
        if (!isNaN(numberPart)) {
            sequence = numberPart;
        }
    }

    // Increment the sequence number for the new ticketed code
    sequence++;

    // Zero-pad the sequence number to ensure it has 4 digits, e.g., '0001'
    const paddedSequence = String(sequence).padStart(4, '0');

    // Construct the new ticketed code by combining the prefix and the padded sequence
    const newCode = `${codePrefix}${paddedSequence}`; // e.g., '202412110001'

    return newCode; // Return the newly generated code
}

// Export the function for use in other modules (if needed)
module.exports = generateTicketedCode;
