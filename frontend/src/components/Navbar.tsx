// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  currentUser: { role: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Shop App</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {currentUser && <li className="nav-item"><Link className="nav-link" to="/">Products</Link></li>}
            {currentUser && <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>}
            {currentUser && <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>}
            {currentUser && <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>}
            {currentUser?.role === "admin" && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
          </ul>
          <div className="d-flex">
            {currentUser ? (
              <button className="btn btn-outline-danger" onClick={onLogout}>Logout</button>
            ) : (
              <>
                <Link className="btn btn-outline-primary me-2" to="/login">Sign In</Link>
                <Link className="btn btn-outline-success" to="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
