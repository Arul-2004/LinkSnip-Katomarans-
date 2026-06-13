import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiLink, 
  FiBarChart2, 
  FiSettings, 
  FiUpload, 
  FiGrid, 
  FiPlus, 
  FiLogOut 
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard/home', label: 'Home', icon: <FiHome /> },
    { to: '/dashboard/links', label: 'Links', icon: <FiLink /> },
    { to: '/dashboard/qr-codes', label: 'QR Codes', icon: <FiGrid /> },
    { to: '/dashboard/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    { to: '/dashboard/bulk-upload', label: 'Bulk Upload', icon: <FiUpload /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard/home" className="sidebar-logo">
          Link<span>Snip</span>
        </Link>
      </div>

      <Link to="/dashboard/create" className="sidebar-create-btn">
        <FiPlus />
        <span>Create new</span>
      </Link>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="sidebar-user-name truncate">{user?.name || 'User'}</div>
          <div className="sidebar-user-email truncate">{user?.email || ''}</div>
        </div>
        <button 
          onClick={handleLogout} 
          className="sidebar-toggle" 
          title="Log Out"
          style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FiLogOut />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
