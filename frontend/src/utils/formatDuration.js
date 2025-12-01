export const formatDuration=(seconds)=> {
  seconds = Math.floor(seconds); // remove decimals

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    // Example: 1:02:05
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  } else {
    // Example: 2:05 or 45s
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}