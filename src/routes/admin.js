// src/routes/admin.js
const express = require("express");
const router = express.Router();
const {
  runTimezoneAwareReset,
  triggerResetForUser,
  getResetStatus,
} = require("../services/cronService");

// POST /api/admin/reset - Manually trigger timezone-aware reset
router.post("/reset", async (req, res) => {
  try {
    await runTimezoneAwareReset();
    res.json({ message: "Timezone-aware reset completed successfully" });
  } catch (error) {
    console.error("Manual reset error:", error);
    res.status(500).json({ error: "Failed to run daily reset" });
  }
});

// POST /api/admin/reset/:userId - Manually trigger reset for one user
router.post("/reset/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await triggerResetForUser(userId);
    res.json(result);
  } catch (error) {
    console.error("User reset error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/reset-status - Check reset status for all users
router.get("/reset-status", async (req, res) => {
  try {
    const status = await getResetStatus();
    res.json({ users: status });
  } catch (error) {
    console.error("Get reset status error:", error);
    res.status(500).json({ error: "Failed to get reset status" });
  }
});

module.exports = router;
