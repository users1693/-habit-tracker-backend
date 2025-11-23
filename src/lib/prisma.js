// src/lib/prisma.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "error", "warn"], // Helpful for debugging
});

module.exports = prisma;
