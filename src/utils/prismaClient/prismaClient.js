const { PrismaClient } = require("@prisma/client");

const prismaClient = () => {
  const prisma = new PrismaClient();
  return prisma;
};

module.exports = {
    prismaClient
};
