const levelNames = [
  "Novice", // From 0 to 4999 coins
  "Coder", // From 5000 coins to 24,999 coins
  "Developer", // From 25,000 coins to 99,999 coins
  "Engineer", // From 100,000 coins to 999,999 coins
  "Architect", // From 1,000,000 coins to 2,000,000 coins
  "Innovator", // From 2,000,000 coins to 10,000,000 coins
  "Pioneer", // From 10,000,000 coins to 50,000,000 coins
  "Guru", // From 50,000,000 coins to 100,000,000 coins
  "Mastermind", // From 100,000,000 coins to 1,000,000,000 coins
  "Legend", // From 1,000,000,000 coins to ∞
  "Visionary", // from 18b
];

const levelMinPoints = [
  0, // Novice
  5000, // Coder
  25000, // Developer
  100000, // Engineer
  1000000, // Architect
  2000000, // Innovator
  10000000, // Pioneer
  50000000, // Guru
  100000000, // Mastermind
  1000000000, // Legend
  18000000000, // Visionary
]


export { levelNames, levelMinPoints }
