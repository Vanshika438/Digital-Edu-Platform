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
        try {
            if (isRegister) {
                await axios.post("http://localhost:5000/auth/register", { name, email, password });
                alert("Registration successful!");
                loginWithUsernamePassword(email, password, navigate);
            } else {
                loginWithUsernamePassword(email, password, navigate);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data.message || "Network Error! Check backend.");
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
                <button type="submit" className="btn btn-full">{isRegister ? "Register" : "Login"}</button>
            </form>

            {!isRegister && (
                <>
                    <div className="separator">or</div>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            loginWithGoogle(credentialResponse.credential, navigate);
                        }}
                        onError={() => alert("Google Login Failed")}
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
