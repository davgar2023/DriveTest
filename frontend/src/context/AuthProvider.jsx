import {  useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Import the Axios instance
//const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

/**
 * Auth Provider Component
 * @param {Object} props - Component properties
 */
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken, user: jwtDecode(accessToken) };
    }
    return { accessToken: null, refreshToken: null, user: null };
  });

  const [lastActivity, setLastActivity] = useState(Date.now());

  /**
   * Login function
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   */
  const login = useCallback((accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAuth({ accessToken, refreshToken, user: jwtDecode(accessToken) });
    setLastActivity(Date.now());
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {

   const refreshToken = localStorage.getItem('refreshToken');
   if (refreshToken) {
     api.post('/api/auth/logout', { token: refreshToken })
       .catch((err) => {
         console.error('Error logging out:', err);
       });
   }


    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuth({ accessToken: null, refreshToken: null, user: null });
    navigate('/login'); // Redirect to login page
  }, [navigate]);

  /**
   * Decode access token whenever it changes
   */
  useEffect(() => {
    if (auth.accessToken) {
      try {
        const decoded = jwtDecode(auth.accessToken);
        setAuth((prev) => ({ ...prev, user: decoded }));
      } catch (error) {
        console.error('Failed to decode token', error);
        logout();
      }
    }
  }, [auth.accessToken, logout]);

  /**
   *  Inactivity Handling
   * Track user activity and log out after INACTIVITY_TIMEOUT of no activity.
   */

  // Reset the activity timer whenever the user moves the mouse or presses a key
  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const interval = setInterval(() => {
      if (auth.accessToken && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 60 * 1000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, [auth.accessToken, lastActivity, logout]);




  /**
   * Axios Interceptors for Token Refresh
   */
  useEffect(() => {
    // Request interceptor to attach access token
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (auth.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await api.post('/api/auth/refresh', { token: auth.refreshToken });
            const { accessToken } = res.data;
            login(accessToken, auth.refreshToken); // Update access token
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.accessToken, auth.refreshToken, login, logout]);


  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
export default AuthProvider;

