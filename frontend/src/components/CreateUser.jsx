import  { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import  AuthContext  from '../context/AuthContext';
import api from '../api/axios'; // Import the Axios instance
import { useNavigate } from 'react-router-dom';
import { getRoles } from '../api/roleApi'; 


/**
 * Users Component
 */
const Users = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleName: '' });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]); 
  const navigate = useNavigate();



  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles( auth.accessToken );
        setRoles(data || []);
      } catch (err) {
        console.error(err);
        setError(`Error fetching roles: ${err?.response?.data?.message}`);
      }
    };
  
    if (auth.accessToken) { 
      fetchRoles();
    }
  }, [auth.accessToken]);

  /**
   * Handle Input Change
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle Form Submit
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', formData);
      const { accessToken, refreshToken } = res.data;
      login(accessToken, refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Users</h2>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="email" className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="password" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="roleName" className="mt-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="roleName"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
        <Button type="submit" className="mt-3">
          Create user
        </Button>
      </Form>
    </Container>
  );
};

export default Users;
