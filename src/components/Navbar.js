// src/components/Navbar.js
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Task Manager Pro</Link>
      <div className="nav-links">
        <Link to="/explore">Explore</Link>
        <Link to="/hire">Hire Designer</Link>
        <Link to="/jobs">Find Jobs</Link>
        <Link to="/blog">Blog</Link>
      </div>
    </nav>
  );
};

export default Navbar;