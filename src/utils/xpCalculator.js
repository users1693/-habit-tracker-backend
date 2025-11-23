// src/utils/xpCalculator.js

const DECAY_FACTOR = 0.95; // 5% decay per day
const MAX_DECAY_DAYS = 30; // Cap decay at 30 days

/**
 * Calculate XP with decay based on streak
 * @param {number} baseXp - Base XP value of the habit
 * @param {number} streak - Current streak count
 * @returns {number} - Calculated XP after decay
 */
function calculateXpWithDecay(baseXp, streak) {
  const effectiveStreak = Math.min(streak, MAX_DECAY_DAYS);
  const multiplier = Math.pow(DECAY_FACTOR, effectiveStreak);
  return Math.round(baseXp * multiplier);
}

/**
 * Calculate XP for a habit completion
 * @param {object} habit - Habit object with baseXpValue and type
 * @param {number} currentStreak - Current streak for this habit
 * @param {number} completionCount - How many times completed today
 * @returns {number} - Total XP earned
 */
function calculateCompletionXp(habit, currentStreak, completionCount = 1) {
  const xpPerCompletion = calculateXpWithDecay(
    habit.baseXpValue,
    currentStreak
  );

  if (habit.type === "BAD") {
    // Bad habits subtract XP
    return -Math.abs(xpPerCompletion * completionCount);
  }

  // Good habits add XP
  return xpPerCompletion * completionCount;
}

module.exports = {
  calculateXpWithDecay,
  calculateCompletionXp,
  DECAY_FACTOR,
  MAX_DECAY_DAYS,
};
