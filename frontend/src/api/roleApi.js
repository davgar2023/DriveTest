
import api from './axios';

/**
 * Fetches the list of roles from the server.
 * 
 * This function sends a GET request to the `/api/roles` endpoint using the Axios instance
 * and retrieves the roles data.
 * 
 * @returns {Promise<Object>} - The response data containing roles (e.g., { roles: [{ _id, name }, ...] }).
 */

export const getRoles = async( accessToken ) =>{
    const res = await api.get('/api/roles', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    return res.data;
};

