import { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", avatar: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recentLessons, setRecentLessons] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        avatar: user.avatar || "",
      });

      fetchProgress();
      fetchRecentLessons();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(data.progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const fetchRecentLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users/recent-lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentLessons(data || []);
    } catch (error) {
      console.error("Error fetching recent lessons:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
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
      const { data } = await axios.put("http://localhost:5000/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data);
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error updating profile.");
    }

    setLoading(false);
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}

      {user ? (
        <>
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-avatar" onClick={handleAvatarClick}>
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
            </div>

            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>New Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" />

            <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Profile"}</button>
          </form>

          {/* User Progress */}
          <h3>Your Progress</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              {Math.round(progress)}%
            </div>
          </div>

          {/* Recently Watched Lessons */}
          <h3>Recently Watched Lessons</h3>
          {recentLessons.length === 0 ? (
            <p>No recent lessons.</p>
          ) : (
            <ul>
              {recentLessons.map((lesson) => (
                <li key={lesson._id}>{lesson.lesson.title} (Last Watched: {new Date(lesson.watchedAt).toLocaleString()})</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Profile;