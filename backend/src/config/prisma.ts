import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

// Prisma 7 requiere un driver adapter en runtime.
// Para MySQL/MariaDB se usa @prisma/adapter-mariadb con la DATABASE_URL.
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);

export const prisma = new PrismaClient({ adapter });
