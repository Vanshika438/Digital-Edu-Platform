import mongoose from "mongoose";
import Lesson from "./models/Lesson.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function seedLessons() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // ✅ Check if lessons already exist
    const existingLessons = await Lesson.countDocuments();
    if (existingLessons > 0) {
      console.log("✅ Lessons already exist. Skipping seeding.");
      return; // ✅ Prevents deleting & recreating lessons
    }

    let teacher = await User.findOne({ role: "teacher" });

    if (!teacher) {
      teacher = new User({
        name: "Default Teacher",
        email: "teacher@example.com",
        password: "password123",
        role: "teacher",
      });

      await teacher.save();
    }

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
    ];

    await Lesson.insertMany(lessons);
    console.log("✅ Default lessons seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
  }
}

export default seedLessons;
