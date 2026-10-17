require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const registrationRoutes = require("./routes/registrations");
const authRoutes = require("./routes/auth");
const announcementRoutes = require("./routes/announcements");
const settingsRoutes = require("./routes/settings");

// Ensure default credentials for admin if not provided via environment
process.env.ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
process.env.JWT_SECRET = process.env.JWT_SECRET || "ai-aura-default-jwt-secret-2026";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "in-memory-fallback",
  });
});

// Database error fallback middleware
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn("[AI Studio] Database offline — returning mock response");
    if (req.method === "GET") {
      return res.json(req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {});
    }
    return res.status(503).json({ error: "Service temporarily unavailable (database offline)" });
  }
  next(err);
});

// Frontend static serving
const buildPath = path.join(__dirname, "../frontend/build");
if (!fs.existsSync(path.join(buildPath, "index.html"))) {
  console.log("⚡ Building frontend for first run...");
  try {
    require("child_process").execSync("npm run build --workspace=frontend", { stdio: "inherit" });
  } catch (buildErr) {
    console.error("Frontend build failed during server startup:", buildErr.message);
  }
}

app.use(express.static(buildPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  const indexHtml = path.join(buildPath, "index.html");
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  return res.status(200).send("AI-AURA is starting up, please reload in a moment.");
});

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-aura";

mongoose.set("bufferCommands", false);

// Attempt MongoDB connection without blocking app startup
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.warn("⚠️ MongoDB offline — using in-memory store fallback:", err.message);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AI-AURA server running on http://0.0.0.0:${PORT}`);
});
