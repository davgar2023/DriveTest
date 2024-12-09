import { useContext } from 'react';
import { Navbar as NavBar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext  from '../context/AuthContext';

/**
 * Navbar Component
 */
const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handle Logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavBar collapseOnSelect expand="lg" variant="dark" bg="dark">
      <Container>
        <NavBar.Brand as={Link} to="/dashboard">
          DriveTest Reports
        </NavBar.Brand>
        <NavBar.Toggle aria-controls="responsive-navbar-nav" />
        <NavBar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard/files">
              Files
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/trpfiles">
              RTP Zip Files
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/reports">
              Reports
            </Nav.Link>
            {/* Add more nav links as needed */}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/dashboard/profile">
              {auth.user?.name || 'Profile'}
            </Nav.Link>
            <Button variant="outline-light" onClick={handleLogout} className="ms-2">
              Logout
            </Button>
          </Nav>
        </NavBar.Collapse>
      </Container>
    </NavBar>
  );
};

export default Navbar;

