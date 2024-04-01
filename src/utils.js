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
