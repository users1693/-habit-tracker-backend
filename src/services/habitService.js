// src/services/habitService.js
const prisma = require("../lib/prisma");

/**
 * Create a new habit for a user
 */
async function createHabit(userId, habitData) {
  const { name, type, baseXpValue, targetCount = 1 } = habitData;

  // Validation
  if (!["GOOD", "BAD"].includes(type)) {
    throw new Error("Type must be GOOD or BAD");
  }

  if (baseXpValue < 1 || baseXpValue > 1000) {
    throw new Error("Base XP must be between 1 and 1000");
  }

  if (targetCount < 1 || targetCount > 50) {
    throw new Error("Target count must be between 1 and 50");
  }

  const habit = await prisma.habit.create({
    data: {
      userId,
      name,
      type,
      baseXpValue,
      targetCount,
      isActive: true,
    },
  });

  return habit;
}

/**
 * Get all active habits for a user
 */
async function getUserHabits(userId) {
  const habits = await prisma.habit.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return habits;
}

/**
 * Get a specific habit by ID
 */
async function getHabitById(habitId, userId) {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId, // Ensure user owns this habit
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  return habit;
}

/**
 * Update a habit
 */
async function updateHabit(habitId, userId, updateData) {
  // Verify ownership
  await getHabitById(habitId, userId);

  const habit = await prisma.habit.update({
    where: { id: habitId },
    data: updateData,
  });

  return habit;
}

/**
 * Delete (soft delete) a habit
 */
async function deleteHabit(habitId, userId) {
  // Verify ownership
  await getHabitById(habitId, userId);

  const habit = await prisma.habit.update({
    where: { id: habitId },
    data: { isActive: false },
  });

  return habit;
}

/**
 * Get habit with today's completion data
 */
async function getHabitWithTodayCompletion(habitId, userId) {
  const habit = await getHabitById(habitId, userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completion = await prisma.habitCompletion.findUnique({
    where: {
      habitId_userId_date: {
        habitId,
        userId,
        date: today,
      },
    },
  });

  return {
    habit,
    completion,
  };
}

module.exports = {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  getHabitWithTodayCompletion,
};
