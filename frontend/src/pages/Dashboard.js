import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import Lessons from "./Lessons";
import "../styles/Dashboard.css";
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
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch lessons with authentication
        const lessonsResponse = await fetch("http://localhost:5000/api/lessons", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const lessonsData = await lessonsResponse.json();
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);

        // Fetch completed lessons if user.id exists
        if (user.id) {
          const completedResponse = await fetch(`http://localhost:5000/api/completed-lessons/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (completedResponse.ok) {
            const completedData = await completedResponse.json();
            setCompletedLessons(Array.isArray(completedData) ? completedData : []);
          }
        }

        // Fetch announcements
        const announcementsResponse = await fetch("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${token}` }
        });

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
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="dashboard-container">
  <h2>{getGreeting()}, {user?.name || "Student"}!</h2>
  <p>Welcome back to your learning!</p>

  <div className="quick-actions">
    <button onClick={() => navigate("/lessons")}>📚 Start a Lesson</button>
    <button onClick={() => navigate("/lessons?last=true")}>⏳ Resume Last Lesson</button>
    <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
  </div>

  <h3>Your Progress</h3>
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${progress}%` }}>
      {Math.round(progress)}%
    </div>
  </div>

  <h3>Available Lessons</h3>
  {lessons.length === 0 ? (
    <p>No lessons available yet.</p>
  ) : (
    <div className="card-grid">
      {lessons.slice(0, 3).map((lesson) => (
        <div key={lesson._id} className={`card ${completedLessons.includes(lesson._id) ? "completed" : ""}`}>
          <h3>{lesson.title}</h3>
          <p>By: {lesson.teacher}</p>
          {lesson.videoUrl && (
            <div className="video-container">
              <iframe src={lesson.videoUrl} title={lesson.title} frameBorder="0" allowFullScreen></iframe>
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  <button className="see-more-button" onClick={() => navigate("/lessons")}>See More Lessons</button>

  <h3>Latest Announcements</h3>
  {announcements.length === 0 ? (
    <p>No announcements yet.</p>
  ) : (
    <div className="card-grid">
      {announcements.map((announcement) => (
        <div key={announcement._id} className="announcement-card">
          <h3>{announcement.title}</h3>
          <p>{announcement.message}</p>
        </div>
      ))}
    </div>
  )}

  <h3>Upcoming Quizzes</h3>
  <p>Feature coming soon! 🚀</p>
    <Chatbot />
</div>
  );
};

export default Dashboard;