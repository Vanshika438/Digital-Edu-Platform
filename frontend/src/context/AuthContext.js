import { createContext, useState, useEffect, useContext } from "react"; // ✅ Import useContext
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); // ✅ Now properly defined
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [user]);

  const loginWithUsernamePassword = async (email, password, navigate) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.message || error.message);
    }
  };

  const loginWithGoogle = async (token, navigate) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/google", { token });

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      console.error("Google Login Failed:", error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithUsernamePassword, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; // ✅ Keep this for other components
