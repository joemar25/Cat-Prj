// src/lib/auth.ts
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const { auth, signIn, signOut, handlers: authHandler } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    ...authConfig,
})