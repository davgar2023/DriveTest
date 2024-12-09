import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import  AuthContext  from '../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * Private Route Component
 * @param {Object} props - Component properties
 */
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  return auth.accessToken ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default PrivateRoute;
