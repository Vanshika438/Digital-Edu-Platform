import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "../styles/Profile.css"; 

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    avatar: user?.avatar || "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "", avatar: user.avatar || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data); // Update global user state
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}
      {user ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-avatar">
            <img src={formData.avatar || "/default-avatar.png"} alt="Profile" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>New Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" />

          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Profile;
