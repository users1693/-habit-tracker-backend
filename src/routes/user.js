// src/routes/user.js
const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const { getXpProgress } = require("../utils/levelSystem");

// GET /api/user/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        currentLevel: true,
        currentXp: true,
        totalXpEarned: true,
        timezone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate XP progress for UI
    const xpProgress = getXpProgress(user.totalXpEarned);

    res.json({
      user,
      progress: xpProgress,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// GET /api/user/:userId/stats
router.get("/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get habit counts - ALL active habits
    const totalHabits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    const goodHabits = await prisma.habit.count({
      where: { userId, isActive: true, type: "GOOD" },
    });

    const badHabits = await prisma.habit.count({
      where: { userId, isActive: true, type: "BAD" },
    });

    // Get today's completion stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCompletions = await prisma.habitCompletion.findMany({
      where: {
        userId,
        date: today,
      },
      include: {
        habit: true,
      },
    });

    // Only count GOOD habits toward completion rate
    const completedGoodHabitsToday = todayCompletions.filter(
      (c) => c.habit.type === "GOOD" && c.completionCount >= c.targetCount
    ).length;

    const xpProgress = getXpProgress(user.totalXpEarned);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        level: user.currentLevel,
        totalXpEarned: user.totalXpEarned,
      },
      progress: xpProgress,
      habits: {
        total: totalHabits,
        good: goodHabits,
        bad: badHabits,
      },
      today: {
        completed: completedGoodHabitsToday, // ← Changed: only good habits
        total: goodHabits, // ← Changed: only count good habits in denominator
        completionRate:
          goodHabits > 0
            ? Math.round((completedGoodHabitsToday / goodHabits) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

module.exports = router;
