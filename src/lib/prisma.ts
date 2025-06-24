import { PrismaClient } from '../generated/prisma';

// Create a singleton instance of PrismaClient to prevent too many connections
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
