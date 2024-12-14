import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import { Routes, Route } from 'react-router-dom';
import FileList from './FileList';
import FileListRtp from './FileListRtp';
import ReportList from './ReportList';
import CreateUser from './CreateUser';
import SitesListAndCreate from '../components/SitesListAndCreate';

/**
 * Dashboard Component
 */
const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Container fluid className="mt-4">
        <Routes>
        <Route path="trpfiles" element={<FileListRtp />} />
          <Route path="files" element={<FileList />} />
          <Route path="reports" element={<ReportList />} />
          <Route path="users" element={<CreateUser />} />
          <Route path="sites" element={<SitesListAndCreate />} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </Container>
    </>
  );
};

const Welcome = () => (
  <div className="text-center text-white">
    <h2>Welcome to the Dashboard</h2>
    <p>Select an option from the menu.</p>
  </div>
);


export default Dashboard;
