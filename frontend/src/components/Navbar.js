import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Navbar.css"; // Applying new styles

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Get the first letter of the user's name (fallback to "U" if no name)
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="navbar animated-navbar">
      <div className="container">
        <h1 className="logo">DEP</h1>
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" className="nav-item">Dashboard</Link></li>
              <li><Link to="/lessons" className="nav-item">Lessons</Link></li>
              <li>
                <Link to="/profile" className="user-avatar">{userInitial}</Link>
              </li>
              <li><button className="btn logout-btn" onClick={logout}>Logout</button></li>
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
