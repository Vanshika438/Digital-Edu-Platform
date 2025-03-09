import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Correctly import useAuth
import "../styles/chatbot.css";

const Chatbot = () => {
  const { user } = useAuth(); // ✅ Get logged-in user
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMessages([]); // ✅ Clear messages when user changes
  }, [user]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userInput }),
      });

      const data = await response.json();
      const botMessage = { text: data.botReply || "I couldn't understand that.", isUser: false };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { text: "API Error! Check console.", isUser: false }]);
    }
  };

  const toggleChatbot = () => {
    setVisible((prev) => !prev);
  };

  return (
    <>
      {!visible && (
        <img
          src={require("../pages/Bot.png")}
          alt="bot icon"
          onClick={toggleChatbot}
          className="bot-icon"
        />
      )}
      <div className={`chatbot-container ${visible ? "visible" : "hidden"}`}>
        <div className="chatbot-header">
          <h2>Edu Assistant</h2>
          <button className="close-chatbot" onClick={toggleChatbot}>
            ✖
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? "user" : "bot"}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="chatbot-input"
          />
          <button onClick={sendMessage} className="chatbot-send-button">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;