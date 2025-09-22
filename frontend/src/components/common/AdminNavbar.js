import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav style={{ backgroundColor: '#f8f9fa', padding: '10px', marginBottom: '20px' }}>
      <Link to="/admin" style={{ marginRight: '10px' }}>Admin Dashboard</Link>
    </nav>
  );
};

export default AdminNavbar;