import { useState, useEffect, useContext , useCallback} from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axios'; // Import the Axios instance
import  AuthContext  from '../context/AuthContext';

/**
 * FileListRtp Component
 * Displays a list of files and allows file operations.
 */
const FileListRtp = () => {
  const { auth } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //const [userId] = useState(auth.user?.id || '');

  /**
   * Fetch the list of files from the server.
   */
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/rtp/reports/list`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
       // params: userId ? { id: userId } : {}, 
      });
      setFiles(res.data.files);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching files');
    } finally {
      setLoading(false);
    }
  }, [auth.accessToken]);


  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  /**
   * Handle file selection.
   * @param {Object} e - Event object
   */
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  /**
   * Handle file upload.
   * @param {Object} e - Event object
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    setError('');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/api/rtp/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
      setShowUploadModal(false);
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    }
  };

  /**
   * Handle file deletion.
   * @param {string} fileId - ID of the file to delete
   */
  const handleDelete = async (fileId) => {
    try {
      await api.delete(`/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting file');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-white">RTP Files</h2>
        <Button variant="success" onClick={() => setShowUploadModal(true)}>
          Upload File
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <Table striped bordered hover variant="dark" responsive className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
            files && files.length > 0 ? (
            files.map((file) => (
              <tr key={file._id || file.name }>
                <td>{file.name}</td>
                <td>{file.size || 'Unknown'}</td>
                <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    href={`/api/files/${file._id}`}
                    target="_blank"
                    className="me-2"
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            )
          )
        ): (
          <tr>
            <td colSpan="4">No files available</td>
          </tr>
        )
        }
          </tbody>
        </Table>
      )}

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="formFile">
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Upload
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FileListRtp;
