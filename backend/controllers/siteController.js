const Site = require('../models/Site');

/**
 * Controller to handle the creation of a new site.
 * This function validates input, checks for duplicate entries, and saves a new site to the database.
 * 
 * @param {Object} req - Express request object containing the site details in the body.
 * @param {Object} res - Express response object used to send responses back to the client.
 */
exports.createSite = async (req, res) => {
  try {
    
    const { name, codeSite, description } = req.body;

    // Validate that required fields are provided.
    if (!name || !codeSite) {
      return res.status(400).json({ message: 'Name and codeSite are required' });
    }

    // Check if a site with the same codeSite already exists in the database.
    const existing = await Site.findOne({ codeSite });
    if (existing) {
      return res.status(400).json({ message: 'Site with this codeSite already exists' });
    }

    // Create a new Site instance with the provided data.
    const site = new Site({ name, codeSite, description });

    // Save the new site to the database.
    await site.save();

    // Respond to the client with a success message and the created site details.
    res.json({ message: 'Site created successfully', site });
  } catch (err) {
    // Log any errors to the console and respond with a generic error message.
    console.error(err);
    res.status(500).json({ message: 'Error creating site' });
  }
};
/**
 * Controller to fetch all sites from the database.
 * 
 * This function retrieves all site records and returns them as a JSON response.
 * 
 * @param {Object} req - Express request object (not used in this function but can include query params or headers).
 * @param {Object} res - Express response object used to send responses back to the client.
 */
exports.getSites = async (req, res) => {
    try {
      // Fetch all site records from the database using Mongoose's find() method.
      const sites = await Site.find({});
  
      // Send the retrieved sites as a JSON response.
      res.json({ sites });
    } catch (err) {
      // Log any errors that occur during the database operation.
      console.error(err);
  
      // Respond with a 500 Internal Server Error status and an error message.
      res.status(500).json({ message: 'Error fetching sites' });
    }
  };
  