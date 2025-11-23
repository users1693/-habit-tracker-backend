// src/utils/colors.js

export const habitColors = [
  { bg: "bg-coral", text: "text-red-800", emoji: "🎯" },
  { bg: "bg-lavender", text: "text-purple-800", emoji: "💼" },
  { bg: "bg-mint", text: "text-green-800", emoji: "🧘" },
  { bg: "bg-peach", text: "text-orange-800", emoji: "🏀" },
  { bg: "bg-sky", text: "text-blue-800", emoji: "💤" },
  { bg: "bg-rose", text: "text-pink-800", emoji: "🎮" },
  { bg: "bg-lemon", text: "text-yellow-800", emoji: "📚" },
];

export const getRandomColor = () => {
  return habitColors[Math.floor(Math.random() * habitColors.length)];
};

export const getColorByIndex = (index) => {
  return habitColors[index % habitColors.length];
};

// XP bar gradient colors
export const xpGradient = "from-purple-500 via-pink-500 to-orange-500";
