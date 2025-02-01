// src/lib/auth.config.ts
import { prisma } from '@/lib/prisma'
import { signInSchema } from '@/lib/validation'
import { Permission } from '@prisma/client'
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
              roles: {
                include: {
                  role: {
                    include: {
                      permissions: true,
                    },
                  },
                },
              },
            },
          })

          // Restrict login if user does not exist, has no password,
          // or is deactivated (email not verified).
          if (!user || !user.accounts[0]?.password || !user.emailVerified) {
            return null
          }

          const isPasswordValid = await compare(
            credentials.password as string,
            user.accounts[0].password
          )
          if (!isPasswordValid) return null

          // Flatten permissions from all roles
          const permissions = new Set<Permission>()
          user.roles.forEach((userRole) => {
            userRole.role.permissions.forEach((p) => {
              permissions.add(p.permission)
            })
          })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            roles: user.roles.map((ur) => ur.role.name),
            permissions: Array.from(permissions),
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

      if (publicRoutes.includes(pathname)) return true
      if (authRoutes.includes(pathname)) {
        return isLoggedIn ? Response.redirect(new URL('/', nextUrl)) : true
      }
      return isLoggedIn
    },

    jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.id = user.id
        token.roles = user.roles
        token.permissions = user.permissions
        token.image = user.image
      }

      if (trigger === 'update' && session) {
        // Return new token with updated values
        return { ...token, ...session }
      }

      return token
    },

    async session({ session, token }): Promise<Session> {
      // Return session with user data from token
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          roles: token.roles as string[],
          permissions: token.permissions as Permission[],
          email: token.email as string,
          name: token.name as string,
          image: token.image as string | null,
        },
        expires: session.expires,
      }
    },
  },

  pages: {
    signIn: '/auth',
  },
} satisfies NextAuthConfig
