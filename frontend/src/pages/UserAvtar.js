import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

const UserAvatar = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="user-avatar-container">
      <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      {dropdownOpen && (
        <div className="user-dropdown">
          <button onClick={() => navigate("/profile")}>👤 My Profile</button>
          <button onClick={() => navigate("/playlists")}>🎵 My Playlists</button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
