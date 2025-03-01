import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Welcome to DigitalEdu!", content: "New courses coming soon!" },
    { id: 2, title: "System Maintenance", content: "Scheduled maintenance on Sunday." },
  ]);
});

export default router;
