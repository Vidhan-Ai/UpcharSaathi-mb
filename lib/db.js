import { PrismaClient } from '@prisma/client';

// Create a single instance of Prisma Client and reuse it across the app
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, prevent multiple instances of Prisma Client in hot reloading
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}