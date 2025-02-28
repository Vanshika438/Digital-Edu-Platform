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
    axios.get("http://localhost:5000/api/lessons")
      .then(response => setLessons(response.data))
      .catch(error => console.error("Error fetching lessons:", error));

    if (user) {
      axios.get(`http://localhost:5000/api/lessons/${user._id}/completed-lessons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(response => setCompletedLessons(response.data))
        .catch(error => console.error("Error fetching completed lessons:", error));
    }
  }, [user]);

  const handleComplete = async (lessonId) => {
    try {
      await axios.post(`http://localhost:5000/api/lessons/${lessonId}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setCompletedLessons(prev => [...prev, lessonId]);
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  const completionPercentage = lessons.length
    ? (completedLessons.length / lessons.length) * 100
    : 0;

  return (
    <div className="lessons-container">
      <h2>Available Lessons</h2>

      {user?.role === "teacher" && (
        <Link to="/add-lesson">
          <button className="add-lesson-btn">Add New Lesson</button>
        </Link>
      )}

      {/* ✅ Progress Bar */}
      {user?.role === "student" && lessons.length > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercentage}%` }}>
            {Math.round(completionPercentage)}%
          </div>
        </div>
      )}

      <ul className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson._id} className={`lesson-item ${completedLessons.includes(lesson._id) ? "completed" : ""}`}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <p><strong>Uploaded by:</strong> {lesson.uploadedBy?.name || "Unknown"}</p>

            {lesson.videoUrl && (
              <div className="video-container">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {user?.role === "student" && !completedLessons.includes(lesson._id) && (
              <button className="complete-btn" onClick={() => handleComplete(lesson._id)}>
                Mark as Completed
              </button>
            )}

            {user?.role === "student" && completedLessons.includes(lesson._id) && (
              <p className="completed-text">✅ Completed</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lessons;
