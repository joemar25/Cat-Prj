// src/lib/auth.config.ts
import { prisma } from '@/lib/prisma'
import { signInSchema } from '@/lib/validation'
import { Permission } from '@prisma/client'
import { compare } from 'bcryptjs'
import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const parsedCredentials = signInSchema.safeParse(credentials)
          if (!parsedCredentials.success) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              accounts: {
                where: { providerId: 'credentials' },
                select: { password: true },
              },
              roles: {
                include: {
                  role: { include: { permissions: true } },
                },
              },
            },
          })

          if (!user?.accounts[0]?.password || !user.emailVerified) return null

          const isPasswordValid = await compare(
            credentials.password,
            user.accounts[0].password
          )
          if (!isPasswordValid) return null

          const permissions = new Set<Permission>()
          user.roles.forEach((userRole) => {
            userRole.role.permissions.forEach((p) => permissions.add(p.permission))
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
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith('/auth')

      if (isAuthPage) {
        return isLoggedIn ? Response.redirect(new URL('/', nextUrl)) : true
      }
      return isLoggedIn
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.permissions = user.permissions
      }
      if (trigger === 'update' && session) {
        return { ...token, ...session }
      }
      return token
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          roles: token.roles,
          permissions: token.permissions,
        },
      }
    },
  },
}