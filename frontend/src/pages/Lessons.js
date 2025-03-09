import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../styles/Lesson.css";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // ✅ Add YouTube API key

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { user } = useContext(AuthContext);
  const [videoProgress, setVideoProgress] = useState({}); // Store last watched time

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
        const { data } = await axios.get("http://localhost:5000/api/users/completed-lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedLessons(data);
      } catch (error) {
        console.error("❌ Error fetching completed lessons:", error.response?.data || error.message);
      }
    };

    if (user) {
      fetchLessons();
      fetchCompletedLessons();
      loadVideoProgress();
    }
  }, [user]);

  const loadVideoProgress = () => {
    const storedProgress = JSON.parse(localStorage.getItem("videoProgress")) || {};
    setVideoProgress(storedProgress);
  };

  const saveProgress = async (lessonId, time) => {
    const newProgress = { ...videoProgress, [lessonId]: time };
    setVideoProgress(newProgress);
    localStorage.setItem("videoProgress", JSON.stringify(newProgress));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users/progress", { lessonId, time }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("❌ Error saving progress:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (window.YT) {
      loadYouTubeAPI();
    } else {
      const tag = document.createElement("script");
      tag.src = `https://www.youtube.com/iframe_api?key=${YOUTUBE_API_KEY}`; // ✅ Include API key
      tag.onload = loadYouTubeAPI;
      document.body.appendChild(tag);
    }
  }, [lessons]);

  const loadYouTubeAPI = () => {
    lessons.forEach((lesson) => {
      if (lesson.videoUrl) {
        new window.YT.Player(`youtube-player-${lesson._id}`, {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                const interval = setInterval(async () => {
                  const currentTime = event.target.getCurrentTime();
                  saveProgress(lesson._id, currentTime);
                }, 5000);
                event.target.interval = interval;
              }
              if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                clearInterval(event.target.interval);
              }
            },
            onReady: (event) => {
              if (videoProgress[lesson._id]) {
                event.target.seekTo(videoProgress[lesson._id]);
              }
            }
          }
        });
      }
    });
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

      <div className="lesson-grid">
        {lessons.map(lesson => (
          <div key={lesson._id} className={`lesson-card ${completedLessons.includes(lesson._id) ? "completed" : ""}`}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <p><strong>Uploaded by:</strong> {lesson.uploadedBy?.name || "Unknown"}</p>

            {lesson.videoUrl && (
              <div className="video-container">
                <iframe
                  id={`youtube-player-${lesson._id}`}
                  src={`${lesson.videoUrl}?enablejsapi=1&key=${YOUTUBE_API_KEY}`}
                  title={lesson.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {lesson.notesUrl && (
              <a href={lesson.notesUrl} target="_blank" rel="noopener noreferrer">
                <button className="download-notes-btn">📄 Download Notes</button>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;