import axios from 'axios';

/**
 * Axios instance with base URL configured.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
