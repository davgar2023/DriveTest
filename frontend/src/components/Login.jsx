
import { useState, useContext } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import  AuthContext  from '../context/AuthContext';
import api from '../api/axios'; // Import the Axios instance
import { useNavigate } from 'react-router-dom';


/**
 * Login Component
 */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await api.post('/api/auth/login', formData);
      const { accessToken, refreshToken } = res.data;
      login(accessToken, refreshToken);
     // login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container className="mt-5">
    <Row className="justify-content-center">
      <Col xs={12} md={6} lg={4}>
        <Card bg="dark" text="white" className="p-4">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="mt-4 w-100">
                Login
              </Button>
            </Form>
           
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  );
};

export default Login;
