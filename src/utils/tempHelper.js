export function formatTemp(celsius, unit) {
  if (celsius === undefined || celsius === null) return "--";
  const value = unit === "F" ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}