import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/Profile.css"; // Ensure this file exists for styling

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-card">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Profile;
