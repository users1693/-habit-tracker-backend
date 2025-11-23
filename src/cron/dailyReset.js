// src/cron/dailyReset.js
const cron = require("node-cron");
const { runTimezoneAwareReset } = require("../services/cronService");

/**
 * Schedule timezone-aware reset to run every hour
 * This checks all users and only resets those who crossed midnight
 */
function startTimezoneAwareResetJob() {
  console.log("🌍 Scheduling timezone-aware reset job...");

  // Run every hour at :00 minutes
  cron.schedule("0 * * * *", async () => {
    console.log("\n⏰ Hourly check triggered at:", new Date().toISOString());
    try {
      await runTimezoneAwareReset();
    } catch (error) {
      console.error("Failed to run timezone-aware reset:", error);
    }
  });

  console.log("✅ Timezone-aware reset job scheduled (runs every hour)");
  console.log('   Pattern: "0 * * * *" = Every hour at :00 minutes');
}

/**
 * For testing: Run every minute
 */
function startTestResetJob() {
  console.log("🧪 TEST MODE: Timezone-aware reset every minute...");

  cron.schedule("* * * * *", async () => {
    console.log("\n🧪 TEST: Checking at:", new Date().toISOString());
    try {
      await runTimezoneAwareReset();
    } catch (error) {
      console.error("Failed to run test reset:", error);
    }
  });

  console.log("✅ TEST: Reset job scheduled every minute");
}

module.exports = {
  startTimezoneAwareResetJob,
  startTestResetJob,
};
