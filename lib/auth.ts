import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
