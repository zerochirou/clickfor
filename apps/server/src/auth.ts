import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { prisma } from './db/db.service';
import { bearer } from 'better-auth/plugins';

const baseURL = process.env.BASE_URL || 'http://localhost:4000';
const clientURL = process.env.CLIENT_URL || 'http://localhost:3001';
const trustedOriginsFromEnv = process.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',').map((o) => o.trim())
  : [];

const trustedOrigins = Array.from(
  new Set(
    [
      clientURL,
      'http://localhost:3000',
      'http://localhost:3001',
      ...trustedOriginsFromEnv,
    ].filter(Boolean),
  ),
);

const isProduction = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: baseURL,
  clientURL: clientURL,
  basePath: '/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      '/api/auth/sign-in/email': {
        window: 60,
        max: 5,
      },
      '/api/auth/sign-up/email': {
        window: 60,
        max: 3,
      },
      '/api/auth/change-password': {
        window: 60,
        max: 3,
      },
      '/api/auth/change-email': {
        window: 60,
        max: 3,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    freshAge: 60 * 60, // 1 hour for sensitive actions
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
      strategy: 'compact',
    },
  },
  account: {
    encryptOAuthTokens: true,
    storeStateStrategy: 'cookie',
  },
  advanced: {
    useSecureCookies: isProduction,
    cookiePrefix: 'clickfor',
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: isProduction,
      httpOnly: true,
    },
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
      disableIpTracking: false,
    },
  },
  trustedOrigins: trustedOrigins,
  plugins: [bearer()],
});
