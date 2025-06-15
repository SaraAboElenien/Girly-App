import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery); 
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">✿ GirlTalk</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                aria-current={isActive('/') ? 'page' : undefined}
                to="/"
              >
                <i className="fas fa-home"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                to="/profile"
              >
                <i className="fas fa-heart"></i> Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/pics') ? 'active' : ''}`}
                to="/pics"
              >
                <i className="fas fa-camera"></i> Pics
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                to="/dashboard"
              >
                <i className="fas fa-bell"></i> Updates
              </Link>
            </li>
          </ul>
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search friends..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;