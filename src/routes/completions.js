// src/routes/completions.js
const express = require("express");
const router = express.Router();
const completionService = require("../services/completionService");

// GET /api/completions/today?userId=xxx - Get today's completions
router.get("/today", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const completions = await completionService.getTodayCompletions(userId);
    res.json({ completions });
  } catch (error) {
    console.error("Get completions error:", error);
    res.status(500).json({ error: "Failed to get completions" });
  }
});

// POST /api/completions/increment - Add a completion (+XP)
router.post("/increment", async (req, res) => {
  try {
    const { habitId, userId } = req.body;

    if (!habitId || !userId) {
      return res.status(400).json({ error: "habitId and userId are required" });
    }

    const result = await completionService.incrementCompletion(habitId, userId);

    res.json({
      message: "Completion added",
      completion: result.completion,
      xpEarned: result.xpEarned,
    });
  } catch (error) {
    console.error("Increment completion error:", error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/completions/decrement - Remove a completion (-XP)
router.post("/decrement", async (req, res) => {
  try {
    const { habitId, userId } = req.body;

    if (!habitId || !userId) {
      return res.status(400).json({ error: "habitId and userId are required" });
    }

    const result = await completionService.decrementCompletion(habitId, userId);

    res.json({
      message: "Completion removed",
      completion: result.completion,
      xpRemoved: result.xpRemoved,
    });
  } catch (error) {
    console.error("Decrement completion error:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
