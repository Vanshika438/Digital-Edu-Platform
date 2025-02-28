import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LessonDetails = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lessons/${id}`)
      .then((response) => setLesson(response.data))
      .catch((error) => console.error("Error fetching lesson:", error));
  }, [id]);

  if (!lesson) return <p>Loading...</p>;

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>
    </div>
  );
};

export default LessonDetails;
