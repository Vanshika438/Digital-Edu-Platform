import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import Chatbot from "./Chatbot"; // Import the Chatbot component

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch lessons
        const lessonsResponse = await fetch("http://localhost:5000/api/lessons");
        const lessonsData = await lessonsResponse.json();
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);

        // Fetch completed lessons
        const completedResponse = await fetch(`http://localhost:5000/api/completed-lessons/${user.id}`, {
          credentials: "include",
        });
        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          setCompletedLessons(Array.isArray(completedData) ? completedData : []);
        }

        // Fetch announcements
        const announcementsResponse = await fetch("http://localhost:5000/api/announcements");
        const announcementsData = await announcementsResponse.json();
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSeeMore = () => {
    navigate("/lessons");
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // Calculate progress percentage
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  return (
    <div className="dashboard-container">
      <h2>{getGreeting()}, {user?.name || "Student"}!</h2>
      <p>Welcome back to your learning!</p>

      {/* ✅ Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate("/lessons")}>📚 Start a Lesson</button>
        <button onClick={() => navigate("/lessons?last=true")}>⏳ Resume Last Lesson</button>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* ✅ Progress Tracking */}
      <h3>Your Progress</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* ✅ Available Lessons with Videos */}
      <h3>Available Lessons</h3>
      {lessons.length === 0 ? (
        <p>No lessons available yet.</p>
      ) : (
        <ul className="lesson-list">
          {lessons.slice(0, 3).map((lesson) => (
            <li key={lesson._id} className={`lesson-item ${completedLessons.includes(lesson._id) ? "completed" : ""}`}>
              <strong>{lesson.title}</strong> - {lesson.teacher}
              
              {/* ✅ Display Video */}
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
            </li>
          ))}
        </ul>
      )}

      <button className="see-more-button" onClick={handleSeeMore}>See More Lessons</button>

      {/* ✅ Announcements */}
      <h3>Latest Announcements</h3>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <ul className="announcement-list">
          {announcements.map((announcement) => (
            <li key={announcement._id} className="announcement-item">
              <strong>{announcement.title}</strong>: {announcement.message}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Upcoming Features */}
      <h3>Upcoming Quizzes</h3>
      <p>Feature coming soon! 🚀</p>

      {/* Chatbot Integration */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;
