import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./Navbar.css"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  // Get the first letter of the user's name (fallback to "U" if no name)
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="navbar animated-navbar">
      <div className="container">
        <h1 className="logo">Digital Edu!</h1>
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" className="nav-item">Dashboard</Link></li>
              <li><Link to="/lessons" className="nav-item">Lessons</Link></li>
              
              {/* ✅ User Avatar with Dropdown */}
              <li className="avatar-container">
                <div 
                  className="user-avatar" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {userInitial}
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>👤 My Profile</Link>
                    <Link to="/playlists" onClick={() => setDropdownOpen(false)}>📂 My Playlists</Link>
                    <button className="logout-btn" onClick={logout}>🚪 Logout</button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li><Link to="/login" className="nav-item">Login / Register</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;