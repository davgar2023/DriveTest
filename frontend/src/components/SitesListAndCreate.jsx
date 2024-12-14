import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { AuthContext } from '../context/AuthProvider'; // Importing the Auth Context for authentication
import { getSites, createSite } from '../api/siteApi'; // Importing API functions for fetching and creating sites

/**
 * Component to display a list of sites and allow the creation of new sites.
 */
const SitesListAndCreate = () => {
  const { auth } = useContext(AuthContext); // Access the auth context for the user's access token

  // State variables
  const [sites, setSites] = useState([]); // Stores the list of sites
  const [error, setError] = useState(''); // Error message
  const [successMessage, setSuccessMessage] = useState(''); // Success message

  // Modal state for toggling the site creation form
  const [showModal, setShowModal] = useState(false);

  // Form fields for creating a new site
  const [siteName, setSiteName] = useState(''); // Site name input
  const [codeSite, setCodeSite] = useState(''); // Code for the site input
  const [description, setDescription] = useState(''); // Optional description input

  // Fetch all sites when the component loads
  useEffect(() => {
    const fetchAllSites = async () => {
      if (!auth.accessToken) return; // Ensure the user is authenticated
      setError(''); // Clear any previous errors
      try {
        const siteList = await getSites(auth.accessToken); // Fetch the sites using the API
        setSites(siteList); // Update the state with the fetched sites
      } catch (err) {
        console.error(err.message);
        setError( `fetching sites ${err?.response?.data?.message}`); // Handle API fetch error
        setSites([]); // ensure sites stays an array even on error
      }
    };
    fetchAllSites();
  }, [auth.accessToken]); // Re-run the effect when the access token changes

  /**
   * Resets form fields and closes the modal.
   */
  const handleCloseModal = () => {
    setSiteName(''); // Reset the site name field
    setCodeSite(''); // Reset the code site field
    setDescription(''); // Reset the description field
    setError(''); // Clear any error messages
    setSuccessMessage(''); // Clear any success messages
    setShowModal(false); // Close the modal
  };

  /**
   * Opens the modal for creating a new site.
   */
  const handleShowModal = () => {
    setShowModal(true); // Open the modal
  };

  /**
   * Handles the creation of a new site.
   * @param {Object} e - The form submission event
   */
  const handleCreateSite = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    // Ensure required fields are filled
    if (!siteName || !codeSite) {
      setError('Name and Code Site are required'); // Display error if fields are empty
      return;
    }

    try {
      // Call the API to create the site
      const site = await createSite(auth.accessToken, {
        name: siteName,
        codeSite,
        description,
      });

      // Add the new site to the sites list
      setSites((prev) => [...prev, site]);

      // Display a success message
      setSuccessMessage(`Site "${site.name}" created successfully!`);

      // Close the modal after success
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error creating site'); // Handle API error
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Card bg="dark" text="white" className="p-4 mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Sites</h2>
                <Button variant="info" onClick={handleShowModal}>Add Site</Button>
              </div>

              {/* Error and success messages */}
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}

              {/* Table to display sites */}
              {sites && sites.length > 0 ? (
                <Table striped bordered hover variant="dark" responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Code Site</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map((s) => (
                      <tr key={s._id}>
                        <td>{s.name}</td>
                        <td>{s.codeSite}</td>
                        <td>{s.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No sites available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for creating a new site */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleCreateSite}>
            <Form.Group controlId="siteName">
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                required
                placeholder="Enter site name"
              />
            </Form.Group>

            <Form.Group controlId="codeSite" className="mt-3">
              <Form.Label>Code Site</Form.Label>
              <Form.Control
                type="text"
                value={codeSite}
                onChange={(e) => setCodeSite(e.target.value)}
                required
                placeholder="Unique code for the site"
              />
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">Create Site</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SitesListAndCreate;
