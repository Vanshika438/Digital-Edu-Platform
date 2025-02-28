import { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "../styles/Forms.css";

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const { loginWithUsernamePassword, loginWithGoogle } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegister) {
            try {
                const response = await axios.post("http://localhost:5000/auth/register", {
                    name,
                    email,
                    password,
                });

                alert("Registration successful!");
                console.log("Response:", response.data);

                // ✅ Instead of setTimeout, wait for the user to be set
                loginWithUsernamePassword(email, password, navigate);
            } catch (error) {
                console.error("Error registering:", error);
                alert("Error: " + (error.response?.data.message || "Network Error! Check backend."));
            }
        } else {
            try {
                // ✅ Use loginWithUsernamePassword function
                loginWithUsernamePassword(email, password, navigate);
            } catch (error) {
                console.error("Error logging in:", error);
                alert("Login failed! " + (error.response?.data.message || "Network Error! Check backend."));
            }
        }
    };

    return (
        <div className="form-container">
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <>
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </>
                )}
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="input-field"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="form-label">Password</label>
                <input
                    type="password"
                    className="input-field"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-full">
                    {isRegister ? "Register" : "Login"}
                </button>
            </form>

            {!isRegister && (
                <>
                    <div className="separator">or</div>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                console.log("Google Login:", credentialResponse);
                                loginWithGoogle(credentialResponse.credential, navigate);
                            } catch (error) {
                                console.error("Google Login Failed:", error);
                                alert("Google login failed.");
                            }
                        }}
                        onError={() => console.error("Google Login Failed")}
                    />
                </>
            )}

            <p className="toggle-link" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </p>
        </div>
    );
};

export default AuthForm;
