import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <div className="logo-icon">✓</div>
          <span className="logo-text">TaskFlow</span>
        </Link>

        {user && (
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        )}

        {user ? (
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link
              to="/dashboard"
              className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Tasks
            </Link>

            {isAdmin && (
              <Link
                to="/admin/users"
                className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Team Management
              </Link>
            )}

            <div className="nav-user-section">
              <div className="user-badge">
                <span className="user-name">{user.name}</span>
                <span className={`role-tag ${user.role}`}>
                  {user.role?.toUpperCase()}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
