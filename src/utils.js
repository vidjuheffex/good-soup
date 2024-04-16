/**
 * Converts a duration in seconds to a string in the format of HH:MM:SS
 * @param {number} seconds
 * @returns {string} duration
 */
export function secondsToDuration(seconds) {
  // Calculate hours, minutes, and seconds
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  // Format hours, minutes, and seconds to always have two digits
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  remainingSeconds = remainingSeconds.toString().padStart(2, "0");

  // Concatenate hours, minutes, and seconds with colon separators
  return `${hours}:${minutes}:${remainingSeconds}`;
}

/**
 * Converts a duration string in the format of HH:MM:SS to seconds
 * @param {string} duration
 * @returns {number} seconds
 */
export function durationToSeconds(duration) {
  const parts = duration
    .split(":")
    .reverse()
    .map((part) => parseInt(part, 10));
  const multipliers = [1, 60, 3600];
  let totalSeconds = 0;
  for (let i = 0; i < parts.length; i++) {
    totalSeconds += parts[i] * (multipliers[i] || 0);
  }
  return totalSeconds;
}
/**
 * Converts a shelf life string to seconds. Shelf lives are measured in
 * days, weeks, months or years. The unit is represented by a single
 * character at the end of the string. eg. "1d", "2w", "3m", "4y"
 * @param {string} shelfLife
 * @returns {number} seconds
 */
export function shelfLifeToSeconds(shelfLife) {
  const unit = shelfLife.slice(-1);
  const value = parseInt(shelfLife.slice(0, -1), 10);

  switch (unit) {
    case "m":
      return value * 30 * 24 * 60 * 60;
    case "w":
      return value * 7 * 24 * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    case "y":
      return value * 365 * 24 * 60 * 60;
    default:
      return 0;
  }
}
/**
 * Adjust a duration based on the number of uses and an exhaustion rate.
 *
 * The exhaustion rate can be a percentage or a fixed value, expresssed
 * as a string. eg. "10%" or "5s"
 * @param {string} duration
 * @param {string} exhaustionRate
 * @param {number} uses
 * @returns {number} seconds
 */
export function calculateAdjustedDuration(durationStr, exhaustionRate, uses) {
  // Convert duration to number, assuming it ends with "s" for seconds.
  let duration = parseFloat(durationStr);
  if (isNaN(duration)) {
    console.error(
      "Invalid duration format. Ensure it's a number or ends with 's' for seconds.",
    );
    return NaN; // Or return some default error value or throw an error
  }

  let adjustedDuration = duration;
  if (!exhaustionRate || uses === 0) return Math.round(adjustedDuration);

  const isPercentage = exhaustionRate.includes("%");
  const rateValue = parseFloat(exhaustionRate);

  if (isPercentage) {
    for (let i = 0; i < uses; i++) {
      adjustedDuration += (adjustedDuration * rateValue) / 100;
    }
  } else {
    // Here, ensure rateValue is treated as seconds if it doesn't include a percentage sign.
    let fixedIncrease = rateValue;
    if (isNaN(fixedIncrease)) {
      console.error(
        "Invalid exhaustionRate format. Ensure it's a number or ends with '%'.",
      );
      return NaN; // Or handle error appropriately
    }
    adjustedDuration += fixedIncrease * uses;
  }

  return Math.round(adjustedDuration);
}
/**
 * Takes a shelflife token and expands it into a human readable string
 * @param {string} shelfLife - One of the following formats: "1d", "2w", "3m", "4y"
 */
export function shelfLifeToString(shelfLife) {
  const unit = shelfLife.slice(-1);
  const value = parseInt(shelfLife.slice(0, -1), 10);

  switch (unit) {
    case "m":
      return `${value} month${value > 1 ? "s" : ""}`;
    case "w":
      return `${value} week${value > 1 ? "s" : ""}`;
    case "d":
      return `${value} day${value > 1 ? "s" : ""}`;
    case "y":
      return `${value} year${value > 1 ? "s" : ""}`;
    default:
      return "Unknown";
  }
}

/**
 * Converts a created date and shelf life to an expiration date
 * @param {string} createdAt
 * @param {string} shelfLife
 * @returns {Date} expirationDate
 */
export function createdDateAndShelfLifeToExpirationDate(createdAt, shelfLife) {
  // Calculate the expiration date
  const shelfLifeInSeconds = shelfLifeToSeconds(shelfLife);
  const createdAtDate = new Date(createdAt);
  return new Date(createdAtDate.getTime() + shelfLifeInSeconds * 1000);
}

export const DURATION_INPUT_PATTERN = "^:?((\\d+:)?\\d+:)?\\d+$";
