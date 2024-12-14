// Import the Axios instance pre-configured for the application
import api from './axios';

/**
 * Fetches the list of sites from the server.
 * 
 * @async
 * @function getSites
 * @param {string} accessToken - The JWT token to authorize the request.
 * @returns {Promise<Array>} A promise that resolves to the list of sites.
 * @throws {Error} If the request fails.
 */
export const getSites = async (accessToken) => {
  // Send a GET request to fetch the list of sites
  const res = await api.get('/api/sites', {
    headers: { Authorization: `Bearer ${accessToken}` } // Include the access token in the Authorization header
  });
  
  // Return the list of sites from the response
  return res.data.sites ? res.data.sites : [];;
};

/**
 * Creates a new site by sending the necessary data to the server.
 * 
 * @async
 * @function createSite
 * @param {string} accessToken - The JWT token to authorize the request.
 * @param {Object} data - The data required to create a new site.
 * @returns {Promise<Object>} A promise that resolves to the created site object.
 * @throws {Error} If the request fails.
 */
export const createSite = async (accessToken, data) => {
  // Send a POST request to create a new site with the provided data
  const res = await api.post('/api/sites', data, {
    headers: { Authorization: `Bearer ${accessToken}` } // Include the access token in the Authorization header
  });
  
  // Return the created site from the response
  return res.data.site;
};
