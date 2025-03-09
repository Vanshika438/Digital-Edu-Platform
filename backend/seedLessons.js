import mongoose from "mongoose";
import Lesson from "./models/Lesson.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function seedLessons() {
  console.log("Starting seeding process...");

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Find or create the default teacher
    let teacher = await User.findOne({ role: "teacher" });

    if (!teacher) {
      teacher = new User({
        name: "Default Teacher",
        email: "teacher@example.com",
        password: "password123",
        role: "teacher",
      });

      await teacher.save();
      console.log("✅ Default teacher created:", teacher);
    } else {
      console.log("⏩ Default teacher already exists:", teacher);
    }

    // Define the lessons to be seeded
    const lessons = [
      {
        title: "Introduction to HTML",
        description: "Learn the basics of HTML.",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/HcOc7P5BMi4",
        notesUrl: "https://drive.google.com/drive/folders/1PmcAPvTZMopb3CwPfVVktiKtwtKFDIJp",
      },
      {
        title: "CSS Fundamentals",
        description: "Understand how to style web pages.",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/ESnrn1kAD4E",
        notesUrl: "https://drive.google.com/drive/folders/1aUkX1itCHXsYgoRdC-RIJgloZmz2eC-F",
      },
      {
        title: "JavaScript Basics",
        description: "Start coding with JavaScript.",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/ajdRvxDWH4w",
        notesUrl: "https://drive.google.com/drive/folders/1nweZ9gZBRqqgPfdPCLJbJPrfuAARV_8e",
      },
      {
        title: "Master Java",
        description: "Learn Java basics and OOPs.",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/UmnCZ7-9yDY",
        notesUrl: "https://drive.google.com/drive/folders/1XvHUQ8NZvZGaUEZyeUb3zi10WnUEkMmR",
      },
      {
        title: "Python Full Course",
        description: "Introduction to Python",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/t2_Q2BRzeEE",
        notesUrl: "https://drive.google.com/drive/folders/1LahwPSc6f9nkxBiRrz6LFUzkrg-Kzvov",
      },
      {
        title: "React Basics",
        description: "Learn the fundamentals of React.",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/BLl32FvcdVM?si=VxLGzxE3l2Veg00a",
        notesUrl: "https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/JS_Chapterwise_Notes.pdf",
      },
      {
        title: "Node.js Crash Course",
        description: "Learn how to build backend applications with Node.js.",
        uploadedBy: teacher._id,
        videoUrl: "https://www.youtube.com/embed/RGKi6LSPDLU?si=AaYGzMBnrHKk4mAL",
        notesUrl: "https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/JS_Chapterwise_Notes.pdf",
      },
    ];

    // Check if each lesson already exists in the database
    for (const lesson of lessons) {
      const existingLesson = await Lesson.findOne({ title: lesson.title });
      if (!existingLesson) {
        await Lesson.create(lesson);
        console.log(`✅ Lesson "${lesson.title}" seeded successfully!`);
      } else {
        console.log(`⏩ Lesson "${lesson.title}" already exists. Skipping.`);
      }
    }

    console.log("✅ All lessons processed successfully!");
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
  } finally {
    // await mongoose.disconnect();
    // console.log("Disconnected from MongoDB");
  }
}

export default seedLessons;