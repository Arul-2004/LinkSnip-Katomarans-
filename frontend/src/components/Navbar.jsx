import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          Link<span>Snip</span>
        </Link>

        {/* Links */}
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/features" className="navbar-link" onClick={() => setIsOpen(false)}>
            Features
          </Link>
          
          <div className="navbar-actions mobile-only">
            {token ? (
              <>
                <Link to="/dashboard/home" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-blue btn-sm" onClick={() => setIsOpen(false)}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="navbar-actions desktop-only">
          {token ? (
            <>
              <Link to="/dashboard/home" className="btn btn-primary">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn btn-outline"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Log In
              </Link>
              <Link to="/register" className="btn btn-blue">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="navbar-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
