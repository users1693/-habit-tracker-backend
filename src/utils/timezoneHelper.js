// src/utils/timezoneHelper.js
const { DateTime } = require("luxon");

/**
 * Get current date/time in a specific timezone
 * @param {string} timezone - IANA timezone (e.g., 'America/New_York')
 * @returns {DateTime} - Luxon DateTime object
 */
function nowInTimezone(timezone) {
  return DateTime.now().setZone(timezone);
}

/**
 * Get the start of today (midnight) in a specific timezone
 * @param {string} timezone - IANA timezone
 * @returns {DateTime} - Midnight in user's timezone
 */
function getTodayMidnightInTimezone(timezone) {
  return DateTime.now().setZone(timezone).startOf("day");
}

/**
 * Get the start of yesterday (midnight) in a specific timezone
 * @param {string} timezone - IANA timezone
 * @returns {DateTime} - Yesterday's midnight in user's timezone
 */
function getYesterdayMidnightInTimezone(timezone) {
  return DateTime.now().setZone(timezone).minus({ days: 1 }).startOf("day");
}

/**
 * Check if midnight has passed in user's timezone since lastResetAt
 * @param {Date|null} lastResetAt - Last time user was reset (UTC)
 * @param {string} timezone - User's timezone
 * @returns {boolean} - True if reset is needed
 */
function needsReset(lastResetAt, timezone) {
  const now = nowInTimezone(timezone);
  const todayMidnight = getTodayMidnightInTimezone(timezone);

  // If never reset, needs reset
  if (!lastResetAt) {
    return true;
  }

  // Convert lastResetAt to user's timezone
  const lastReset = DateTime.fromJSDate(lastResetAt).setZone(timezone);

  // Check if current time is past today's midnight AND
  // last reset was before today's midnight
  const isAfterMidnight = now >= todayMidnight;
  const lastResetBeforeMidnight = lastReset < todayMidnight;

  return isAfterMidnight && lastResetBeforeMidnight;
}

/**
 * Convert a Date to start of day in a specific timezone
 * Returns as JavaScript Date object (for Prisma compatibility)
 */
function toStartOfDayInTimezone(date, timezone) {
  return DateTime.fromJSDate(date).setZone(timezone).startOf("day").toJSDate();
}

/**
 * Get list of all valid IANA timezones
 */
function getValidTimezones() {
  // Common timezones (you can expand this list)
  return [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Dubai",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];
}

/**
 * Validate timezone string
 */
function isValidTimezone(timezone) {
  try {
    DateTime.now().setZone(timezone);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  nowInTimezone,
  getTodayMidnightInTimezone,
  getYesterdayMidnightInTimezone,
  needsReset,
  toStartOfDayInTimezone,
  getValidTimezones,
  isValidTimezone,
};
