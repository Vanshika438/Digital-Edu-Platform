import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Digital Education Platform</h1>
      <p className="home-subtitle">Empowering learning through technology!</p>
      
      <div className="home-buttons">
        <Link to="/login">
          <button className="home-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="home-button register">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;