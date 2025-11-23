// src/services/completionService.js
const prisma = require("../lib/prisma");
const { calculateCompletionXp } = require("../utils/xpCalculator");
const { getLevelFromXp } = require("../utils/levelSystem");

/**
 * Get or create today's completion record
 */
async function getTodayCompletion(habitId, userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  let completion = await prisma.habitCompletion.findUnique({
    where: {
      habitId_userId_date: {
        habitId,
        userId,
        date: today,
      },
    },
  });

  // Create if doesn't exist
  if (!completion) {
    // Calculate streak
    const currentStreak = await calculateCurrentStreak(habitId, userId);

    completion = await prisma.habitCompletion.create({
      data: {
        habitId,
        userId,
        date: today,
        completionCount: 0,
        targetCount: habit.targetCount,
        xpEarned: 0,
        currentStreak,
      },
    });
  }

  return { completion, habit };
}

/**
 * Calculate current streak for a habit
 */
async function calculateCurrentStreak(habitId, userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);
  checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday

  // Go backwards day by day until we find a day with 0 completions
  while (true) {
    const completion = await prisma.habitCompletion.findUnique({
      where: {
        habitId_userId_date: {
          habitId,
          userId,
          date: checkDate,
        },
      },
    });

    // If no record or 0 completions, streak is broken
    if (!completion || completion.completionCount === 0) {
      break;
    }

    streak++;
    checkDate.setDate(checkDate.getDate() - 1);

    // Safety: don't check more than 365 days
    if (streak > 365) break;
  }

  return streak;
}

/**
 * Increment habit completion (adds XP)
 */
async function incrementCompletion(habitId, userId) {
  const { completion, habit } = await getTodayCompletion(habitId, userId);

  // Calculate XP for this single completion
  const xpForThisCompletion = calculateCompletionXp(
    habit,
    completion.currentStreak,
    1 // Just one completion at a time
  );

  // Update completion record
  const updatedCompletion = await prisma.habitCompletion.update({
    where: { id: completion.id },
    data: {
      completionCount: { increment: 1 },
      xpEarned: { increment: xpForThisCompletion },
    },
  });

  // Update user XP and level
  await updateUserXp(userId, xpForThisCompletion);

  return {
    completion: updatedCompletion,
    xpEarned: xpForThisCompletion,
  };
}

/**
 * Decrement habit completion (removes XP)
 */
async function decrementCompletion(habitId, userId) {
  const { completion, habit } = await getTodayCompletion(habitId, userId);

  if (completion.completionCount === 0) {
    throw new Error("Cannot decrement below 0");
  }

  // Calculate XP to remove (same as what was earned)
  const xpToRemove = calculateCompletionXp(habit, completion.currentStreak, 1);

  // Update completion record
  const updatedCompletion = await prisma.habitCompletion.update({
    where: { id: completion.id },
    data: {
      completionCount: { decrement: 1 },
      xpEarned: { decrement: xpToRemove },
    },
  });

  // Update user XP (subtract)
  await updateUserXp(userId, -xpToRemove);

  return {
    completion: updatedCompletion,
    xpRemoved: xpToRemove,
  };
}

/**
 * Update user's XP and level
 */
async function updateUserXp(userId, xpChange) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newTotalXp = Math.max(0, user.totalXpEarned + xpChange);
  const newLevel = getLevelFromXp(newTotalXp);

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalXpEarned: newTotalXp,
      currentLevel: newLevel,
      currentXp: newTotalXp, // Store same as total for now
    },
  });

  const leveledUp = newLevel > user.currentLevel;

  return {
    newTotalXp,
    newLevel,
    leveledUp,
  };
}

/**
 * Get today's completions for a user
 */
async function getTodayCompletions(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completions = await prisma.habitCompletion.findMany({
    where: {
      userId,
      date: today,
    },
    include: {
      habit: true,
    },
  });

  return completions;
}

module.exports = {
  getTodayCompletion,
  calculateCurrentStreak,
  incrementCompletion,
  decrementCompletion,
  getTodayCompletions,
};
