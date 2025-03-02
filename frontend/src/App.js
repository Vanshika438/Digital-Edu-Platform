import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import AddLesson from "./pages/AddLessons";
import Navbar from "./components/Navbar";
import Chatbot from "./pages/Chatbot";
import Playlists from "./pages/Playlists";
import Profile from "./pages/Profile"; 

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/add-lesson" element={<AddLesson />} />
        </Routes>
        <Chatbot />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
