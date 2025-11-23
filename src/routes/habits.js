// src/routes/habits.js
const express = require("express");
const router = express.Router();
const habitService = require("../services/habitService");

// GET /api/habits?userId=xxx - Get all habits for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const habits = await habitService.getUserHabits(userId);
    res.json({ habits });
  } catch (error) {
    console.error("Get habits error:", error);
    res.status(500).json({ error: "Failed to get habits" });
  }
});

// GET /api/habits/:habitId?userId=xxx - Get a specific habit
router.get("/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const habit = await habitService.getHabitById(habitId, userId);
    res.json({ habit });
  } catch (error) {
    console.error("Get habit error:", error);

    if (error.message === "Habit not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to get habit" });
  }
});

// POST /api/habits - Create a new habit
router.post("/", async (req, res) => {
  try {
    const { userId, name, type, baseXpValue, targetCount } = req.body;

    if (!userId || !name || !type || !baseXpValue) {
      return res.status(400).json({
        error: "userId, name, type, and baseXpValue are required",
      });
    }

    const habit = await habitService.createHabit(userId, {
      name,
      type,
      baseXpValue,
      targetCount,
    });

    res.status(201).json({
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/habits/:habitId - Update a habit
router.patch("/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;
    const { userId, name, baseXpValue, targetCount } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (baseXpValue !== undefined) updateData.baseXpValue = baseXpValue;
    if (targetCount !== undefined) updateData.targetCount = targetCount;

    const habit = await habitService.updateHabit(habitId, userId, updateData);

    res.json({
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    console.error("Update habit error:", error);

    if (error.message === "Habit not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/habits/:habitId - Delete a habit (soft delete)
router.delete("/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    await habitService.deleteHabit(habitId, userId);

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Delete habit error:", error);

    if (error.message === "Habit not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to delete habit" });
  }
});

module.exports = router;
