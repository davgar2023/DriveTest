import { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axios'; // Import the Axios instance
import  AuthContext  from '../context/AuthContext';

/**
 * ReportList Component
 * Displays a list of reports and allows report operations.
 */
const ReportList = () => {
  const { auth } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  /**
   * Fetch the list of reports from the server.
   */
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/reports', {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      setReports(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reports');
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /**
   * Handle input change in the form.
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    setCurrentReport({ ...currentReport, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for creating or updating a report.
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        // Update existing report
        await api.put(`/api/reports/${currentReport._id}`, currentReport, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        });
      } else {
        // Create new report
        await api.post('/api/reports', currentReport, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        });
      }
      setShowModal(false);
      fetchReports();
      setCurrentReport({ title: '', description: '' });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving report');
    }
  };

  /**
   * Handle report deletion.
   * @param {string} reportId - ID of the report to delete
   */
  const handleDelete = async (reportId) => {
    try {
      await api.delete(`/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting report');
    }
  };

  /**
   * Open modal for editing a report.
   * @param {Object} report - Report object
   */
  const handleEdit = (report) => {
    setCurrentReport(report);
    setEditing(true);
    setShowModal(true);
  };

  return (
    <div>
      <h2>Reports</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        New Report
      </Button>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.title}</td>
                <td>{report.createdBy?.name || 'Unknown'}</td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(report)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(report._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Report Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditing(false);
        setCurrentReport({ title: '', description: '' });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Report' : 'New Report'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentReport.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={currentReport.description}
                onChange={handleChange}
                rows={4}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editing ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReportList;
