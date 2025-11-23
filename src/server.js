// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");
const completionRoutes = require("./routes/completions");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

// Import timezone-aware cron job
const { startTimezoneAwareResetJob } = require("./cron/dailyReset");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://YOUR_GITHUB_USERNAME.github.io", // ← We'll update this
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/completions", completionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Habit Tracker API is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Habit Tracker API",
    version: "1.0.0",
    endpoints: ["/api/auth", "/api/habits", "/api/completions", "/api/user"],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  // Start the cron job
  startTimezoneAwareResetJob();
});

module.exports = app;
