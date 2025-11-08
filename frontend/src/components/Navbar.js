import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Pet Adoption
        </Link>
        <div className="navbar-nav">
          <Link to="/">Home</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin">Admin Dashboard</Link>
              )}
              <Link to="/dashboard">My Applications</Link>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '14px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

