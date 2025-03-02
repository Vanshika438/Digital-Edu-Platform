import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../styles/style.css";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("❌ No authentication token found.");

        const { data } = await axios.get("http://localhost:5000/api/lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(data);
      } catch (error) {
        console.error("❌ Error fetching lessons:", error.response?.data || error.message);
      }
    };

    const fetchCompletedLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/lessons/completed-lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedLessons(data);
      } catch (error) {
        console.error("❌ Error fetching completed lessons:", error.response?.data || error.message);
      }
    };

    // Fetch lessons and completed lessons only if the user is logged in
    if (user) {
      fetchLessons();
      fetchCompletedLessons();
    }
  }, [user]); // This will run when the user changes

  const handleCompletion = async (lessonId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/lessons/${lessonId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newCompletedLessons = action === "complete"
        ? [...completedLessons, lessonId]
        : completedLessons.filter(id => id !== lessonId);

      setCompletedLessons(newCompletedLessons);
      localStorage.setItem("completedLessons", JSON.stringify(newCompletedLessons)); // Persist in localStorage
    } catch (error) {
      console.error(`❌ Error ${action === "complete" ? "completing" : "uncompleting"} lesson:`, error.response?.data || error.message);
    }
  };

  const completionPercentage = lessons.length ? (completedLessons.length / lessons.length) * 100 : 0;

  return (
    <div className="lessons-container">
      <h2>Available Lessons</h2>

      {user?.role === "teacher" && (
        <Link to="/add-lesson">
          <button className="add-lesson-btn">Add New Lesson</button>
        </Link>
      )}

      {user?.role === "student" && lessons.length > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercentage}%` }}>
            {Math.round(completionPercentage)}%
          </div>
        </div>
      )}

      <ul className="lesson-list">
        {lessons.map(lesson => (
          <li key={lesson._id} className={`lesson-item ${completedLessons.includes(lesson._id) ? "completed" : ""}`}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <p><strong>Uploaded by:</strong> {lesson.uploadedBy?.name || "Unknown"}</p>

            {lesson.videoUrl && (
              <div className="video-container">
                <iframe src={lesson.videoUrl} title={lesson.title} frameBorder="0" allowFullScreen></iframe>
              </div>
            )}

            {/* Download Notes Button */}
            {lesson.notesUrl && (
              <a href={lesson.notesUrl} target="_blank" rel="noopener noreferrer">
                <button className="download-notes-btn">📄 Download Notes</button>
              </a>
            )}

            {user?.role === "student" && (
              <button
                className={completedLessons.includes(lesson._id) ? "uncomplete-btn" : "complete-btn"}
                onClick={() => handleCompletion(lesson._id, completedLessons.includes(lesson._id) ? "uncomplete" : "complete")}
              >
                {completedLessons.includes(lesson._id) ? "❌ Unmark as Completed" : "✅ Mark as Completed"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lessons;
