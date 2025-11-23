// src/utils/levelSystem.js

/**
 * Fibonacci sequence for level requirements
 * Level 1->2: 100 XP
 * Level 2->3: 100 XP
 * Level 3->4: 200 XP
 * Level 4->5: 300 XP
 * Level 5->6: 500 XP
 * etc.
 */
function getXpForLevel(level) {
  if (level <= 1) return 0;
  if (level === 2) return 100;

  let prev = 100;
  let curr = 100;

  for (let i = 3; i <= level; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

/**
 * Calculate total XP needed to reach a level
 * Example: To reach level 5, you need sum of all previous requirements
 */
function getTotalXpForLevel(level) {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

/**
 * Determine current level from total XP
 */
function getLevelFromXp(totalXp) {
  let level = 1;
  let xpRequired = 0;

  while (xpRequired <= totalXp) {
    level++;
    xpRequired += getXpForLevel(level);
  }

  return level - 1;
}

/**
 * Get XP progress for current level
 * Returns: { level, currentXp, xpForNextLevel, xpNeededForNextLevel }
 */
function getXpProgress(totalXp) {
  const level = getLevelFromXp(totalXp);
  const xpForCurrentLevel = getTotalXpForLevel(level);
  const xpForNextLevel = getXpForLevel(level + 1);
  const currentXp = totalXp - xpForCurrentLevel;

  return {
    level,
    currentXp,
    xpForNextLevel,
    xpNeededForNextLevel: xpForNextLevel - currentXp,
  };
}

module.exports = {
  getXpForLevel,
  getTotalXpForLevel,
  getLevelFromXp,
  getXpProgress,
};
