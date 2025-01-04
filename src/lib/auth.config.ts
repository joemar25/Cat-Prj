// src/lib/auth.config.ts
import { prisma } from '@/lib/prisma';
import { signInSchema } from '@/lib/zod';
import { Permission } from '@prisma/client';
import { compare } from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Route definitions
const authRoutes = ['/auth/sign-in', '/auth/sign-up'];
const publicRoutes = ['/auth/sign-in', '/auth/sign-up'];

export default {
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        try {
          // Validate credentials against schema
          const parsedCredentials = signInSchema.safeParse(credentials);
          if (!parsedCredentials.success) return null;

          // Find user and their credentials
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
            include: {
              accounts: {
                where: { providerId: 'credentials' },
                select: { password: true },
              },
            },
          });

          // Check if user and password exist
          if (!user || !user.accounts[0]?.password) return null;

          // Verify password
          const isPasswordValid = await compare(
            credentials.password as string,
            user.accounts[0].password
          );
          if (!isPasswordValid) return null;

          // Return user data on successful authentication
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            role: user.role ?? '-',
            permissions: user.permissions, // Include permissions
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Handle route authorization
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Allow access to public routes
      if (publicRoutes.includes(pathname)) {
        return true;
      }

      // Handle auth routes for logged-in users
      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true; // Allow access to auth pages if not logged in
      }

      // Require authentication for all other routes
      return isLoggedIn;
    },

    // Handle JWT token creation and updates
    jwt({ token, user, trigger, session }) {
      if (user) {
        // Add user data to token
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    // Handle session data
    session({ session, token }) {
      // Add user data to session
      session.user.id = token.id as string;
      session.user.role = token.role as string | undefined;
      session.user.permissions = token.permissions as Permission[] | undefined;

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig;
