import  { useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import  AuthContext  from '../context/AuthContext';
import api from '../api/axios'; // Import the Axios instance
import { useNavigate } from 'react-router-dom';

/**
 * Register Component
 */
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleName: '' });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      //login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
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
        <Form.Group controlId="roleName" className="mt-2">
          <Form.Label>Role</Form.Label>
          <Form.Control type="text" name="roleName" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
