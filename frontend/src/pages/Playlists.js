import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

const Playlists = () => {
    const { user } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const [playlists, setPlaylists] = useState([]);
    const [newPlaylist, setNewPlaylist] = useState("");
    const [lessons, setLessons] = useState([]);
    const [selectedLessons, setSelectedLessons] = useState([]);

    // Fetch Lessons
    const fetchLessons = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/lessons", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLessons(response.data || []);
        } catch (error) {
            console.error("Error fetching lessons:", error.response?.data || error.message);
        }
    }, []);

    // Fetch Playlists
    const fetchPlaylists = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/playlists", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlaylists(response.data || []);
        } catch (error) {
            console.error("Error fetching playlists:", error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchLessons();
        fetchPlaylists();
    }, [fetchLessons, fetchPlaylists]);

    // Create Playlist
    const createPlaylist = async () => {
        if (!newPlaylist.trim()) return alert("Enter a playlist name!");
        if (selectedLessons.length === 0) return alert("Select at least one lesson!");

        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post(
                "http://localhost:5000/api/playlists/create",
                { name: newPlaylist.trim(), lessons: selectedLessons },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPlaylists((prev) => [...prev, data]);
            setNewPlaylist("");
            setSelectedLessons([]);
        } catch (error) {
            console.error("Error creating playlist:", error.response?.data || error.message);
        }
    };

    // Delete Playlist
    const deletePlaylist = async (playlistId) => {
        if (!window.confirm("Are you sure you want to delete this playlist?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPlaylists((prev) => prev.filter((playlist) => playlist._id !== playlistId));
        } catch (error) {
            console.error("Error deleting playlist:", error.response?.data || error.message);
        }
    };

    return (
        <div className="playlists-container">
            <h2>{user?.name ? `${user.name}'s Playlists` : "My Playlists"}</h2>

            <button onClick={() => navigate("/dashboard")} className="navigate-button">
                🔙 Go to Dashboard
            </button>

            <div className="playlist-controls">
                <input
                    type="text"
                    value={newPlaylist}
                    onChange={(e) => setNewPlaylist(e.target.value)}
                    placeholder="Enter playlist name"
                />

                <select
                    multiple
                    value={selectedLessons}
                    onChange={(e) =>
                        setSelectedLessons([...e.target.selectedOptions].map((option) => option.value))
                    }
                >
                    {lessons.length > 0 ? (
                        lessons.map((lesson) => (
                            <option key={lesson._id} value={lesson._id}>
                                {lesson.title}
                            </option>
                        ))
                    ) : (
                        <option disabled>No lessons available</option>
                    )}
                </select>

                <button onClick={createPlaylist}>➕ Create Playlist</button>
            </div>

            <ul className="playlist-list">
                {playlists.length === 0 ? (
                    <p>No playlists yet.</p>
                ) : (
                    playlists.map((playlist) => (
                        <li key={playlist._id} className="playlist-item">
                            <h3>{playlist.name}</h3>
                            <p>{(playlist.lessons || []).length} lessons</p>

                            <ul className="lesson-list">
                                {playlist.lessons.map((lesson) => (
                                    <li key={lesson._id} className="lesson-item">
                                        <h4>{lesson.title}</h4>
                                        {lesson.videoUrl && lesson.videoUrl.includes("youtube.com") ? (
                                            <iframe
                                                width="300"
                                                height="200"
                                                src={lesson.videoUrl.replace("watch?v=", "embed/")}
                                                title={lesson.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <p>Invalid video URL</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => deletePlaylist(playlist._id)}>🗑 Delete</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Playlists;