// src/services/cronService.js
const prisma = require("../lib/prisma");
const {
  needsReset,
  getTodayMidnightInTimezone,
  getYesterdayMidnightInTimezone,
} = require("../utils/timezoneHelper");
const { DateTime } = require("luxon");

/**
 * Run timezone-aware daily reset
 * Checks each user's timezone and only resets if midnight has passed
 */
async function runTimezoneAwareReset() {
  console.log("🌍 Starting timezone-aware daily reset...");
  console.log(`⏰ Server time: ${new Date().toISOString()}`);

  try {
    // Get all active users
    const users = await prisma.user.findMany({
      where: {},
      include: {
        habits: {
          where: { isActive: true },
        },
      },
    });

    console.log(`📊 Checking ${users.length} users across timezones...`);

    let resetCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if this user needs a reset based on their timezone
      if (needsReset(user.lastResetAt, user.timezone)) {
        await processDailyResetForUser(user);
        resetCount++;
      } else {
        skippedCount++;
        console.log(
          `  ⏭️  Skipping ${user.username} (timezone: ${user.timezone}) - not past midnight yet`
        );
      }
    }

    console.log(
      `✅ Reset complete! Reset: ${resetCount}, Skipped: ${skippedCount}`
    );
  } catch (error) {
    console.error("❌ Timezone-aware reset failed:", error);
    throw error;
  }
}

/**
 * Process daily reset for a single user (timezone-aware)
 */
async function processDailyResetForUser(user) {
  const userTimezone = user.timezone;

  // Get today and yesterday in USER'S timezone
  const todayMidnight = getTodayMidnightInTimezone(userTimezone);
  const yesterdayMidnight = getYesterdayMidnightInTimezone(userTimezone);

  console.log(`  🔄 Processing ${user.username} (${userTimezone})`);
  console.log(`     Today: ${todayMidnight.toISO()}`);
  console.log(`     Yesterday: ${yesterdayMidnight.toISO()}`);

  // Convert to JS Date for Prisma
  const today = todayMidnight.toJSDate();
  const yesterday = yesterdayMidnight.toJSDate();

  for (const habit of user.habits) {
    try {
      // Get yesterday's completion
      const yesterdayCompletion = await prisma.habitCompletion.findUnique({
        where: {
          habitId_userId_date: {
            habitId: habit.id,
            userId: user.id,
            date: yesterday,
          },
        },
      });

      // Calculate new streak
      let newStreak = 0;

      if (yesterdayCompletion && yesterdayCompletion.completionCount > 0) {
        // Streak continues - increment
        newStreak = yesterdayCompletion.currentStreak + 1;
        console.log(`     ✓ ${habit.name}: streak continues → ${newStreak}`);
      } else {
        // Streak broken - reset to 0
        newStreak = 0;
        console.log(`     ✗ ${habit.name}: streak broken → 0`);
      }

      // Check if today's record already exists
      const existingToday = await prisma.habitCompletion.findUnique({
        where: {
          habitId_userId_date: {
            habitId: habit.id,
            userId: user.id,
            date: today,
          },
        },
      });

      if (!existingToday) {
        // Create today's blank record
        await prisma.habitCompletion.create({
          data: {
            habitId: habit.id,
            userId: user.id,
            date: today,
            completionCount: 0,
            targetCount: habit.targetCount,
            xpEarned: 0,
            currentStreak: newStreak,
          },
        });
      } else {
        console.log(`     ℹ️  ${habit.name}: today's record already exists`);
      }
    } catch (error) {
      console.error(
        `     ❌ Failed to process habit ${habit.name}:`,
        error.message
      );
    }
  }

  // Update user's lastResetAt to NOW (in UTC)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastResetAt: new Date(), // Store in UTC
    },
  });

  console.log(`  ✅ Reset complete for ${user.username}`);
}

/**
 * Manually trigger reset for a specific user (timezone-aware)
 */
async function triggerResetForUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      habits: {
        where: { isActive: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if reset is needed
  if (!needsReset(user.lastResetAt, user.timezone)) {
    return {
      message: `No reset needed for ${user.username}`,
      reason: "Midnight has not passed in user timezone yet",
      userTimezone: user.timezone,
      lastResetAt: user.lastResetAt,
    };
  }

  await processDailyResetForUser(user);

  return {
    message: `Daily reset completed for ${user.username}`,
    timezone: user.timezone,
  };
}

/**
 * Get reset status for all users (debugging helper)
 */
async function getResetStatus() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      timezone: true,
      lastResetAt: true,
    },
  });

  return users.map((user) => {
    const now = DateTime.now().setZone(user.timezone);
    const todayMidnight = getTodayMidnightInTimezone(user.timezone);
    const needsResetNow = needsReset(user.lastResetAt, user.timezone);

    return {
      username: user.username,
      timezone: user.timezone,
      localTime: now.toFormat("yyyy-MM-dd HH:mm:ss"),
      lastResetAt: user.lastResetAt?.toISOString() || "Never",
      needsReset: needsResetNow,
      nextMidnight: todayMidnight.plus({ days: 1 }).toISO(),
    };
  });
}

module.exports = {
  runTimezoneAwareReset,
  triggerResetForUser,
  getResetStatus,
};
