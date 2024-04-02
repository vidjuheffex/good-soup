/**
 * Converts a duration in seconds to a string in the format of HH:MM:SS
 * @param {number} seconds
 * @returns {string} duration
 */
export function secondsToDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let parts = [];
  if (hours > 0) parts.push(hours);
  if (hours > 0 || minutes > 0 || seconds < 60)
    parts.push(`${minutes < 10 && hours ? `0${minutes}` : minutes}`);
  if (seconds >= 60)
    parts.push(
      `${
        remainingSeconds < 10 && (minutes || hours)
          ? `0${remainingSeconds}`
          : remainingSeconds
      }`
    );
  if (seconds < 60) return `${remainingSeconds}`;
  return parts.join(":");
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
