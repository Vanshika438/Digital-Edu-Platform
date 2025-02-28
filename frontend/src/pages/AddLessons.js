import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddLesson = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // ✅ Add this state
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/lessons",
        { title, description, videoUrl }, // ✅ Include videoUrl
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Lesson added successfully!");
      navigate("/lessons"); // Redirect back to lessons
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  if (user?.role !== "teacher") {
    return <p>Access Denied. Only teachers can add lessons.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Lesson</h2>
      <input type="text" placeholder="Lesson Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Lesson Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      <input type="text" placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required /> {/* ✅ Add video input */}
      <button type="submit">Add Lesson</button>
    </form>
  );
};

export default AddLesson;
