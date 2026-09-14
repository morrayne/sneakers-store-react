export function getSizesForCategory(category: "men" | "women" | "unisex"): number[] {
  const men = [40, 41, 42, 43, 44, 45, 46];
  const women = [36, 37, 38, 39, 40, 41];

  switch (category) {
    case "men":
      return men;
    case "women":
      return women;
    case "unisex":
      // объединение без дублей, по возрастанию
      return [...new Set([...women, ...men])].sort((a, b) => a - b);
  }
}
