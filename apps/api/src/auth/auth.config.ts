import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'resucraft-local-development-secret-key-must-be-at-least-32-chars-long!',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
  basePath: '/api/auth',
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.CORS_ORIGIN || 'http://localhost:3000',
  ],
});
