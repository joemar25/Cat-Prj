// src/lib/auth.config.ts
import { prisma } from '@/lib/prisma'
import { signInSchema } from '@/lib/zod'
import { Permission, UserRole } from '@prisma/client'
import { compare } from 'bcryptjs'
import { NextAuthConfig, Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const authRoutes = ['/auth/sign-in', '/auth/sign-up']
const publicRoutes = ['/auth/sign-in', '/auth/sign-up']

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
          const parsedCredentials = signInSchema.safeParse(credentials)
          if (!parsedCredentials.success) return null

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
          })

          if (!user || !user.accounts[0]?.password) return null

          const isPasswordValid = await compare(
            credentials.password as string,
            user.accounts[0].password
          )
          if (!isPasswordValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            role: user.role,
            permissions: user.permissions,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      if (publicRoutes.includes(pathname)) {
        return true
      }

      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      }

      return isLoggedIn
    },

    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as UserRole,
          permissions: token.permissions as Permission[],
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
        expires: session.expires
      }
    },
  },

  pages: {
    signIn: '/auth',
  },
} satisfies NextAuthConfig