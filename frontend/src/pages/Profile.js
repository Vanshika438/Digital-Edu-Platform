import { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", avatar: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Trigger file input click when avatar is clicked
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      const token = localStorage.getItem("token");
      console.log("Sending request to update profile:", formData);
  
      const { data } = await axios.put("http://localhost:5000/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Profile updated successfully:", data);
      setUser(data);
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "❌ Error updating profile.");
    }
  
    setLoading(false);
  };
  

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}

      {user ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-avatar" onClick={handleAvatarClick}>
            {formData.avatar ? (
              <img src={formData.avatar} alt="Profile" className="avatar" />
            ) : (
              <div className="avatar-placeholder">{getInitial(formData.name)}</div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>New Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Profile;
