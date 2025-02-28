import React, { useState } from "react";
import axios from "axios";

const LessonForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/lessons", { title, description });
      alert("Lesson added successfully!");
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Lesson</h2>
      <input type="text" placeholder="Lesson Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Lesson Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      <button type="submit">Add Lesson</button>
    </form>
  );
};

export default LessonForm;
