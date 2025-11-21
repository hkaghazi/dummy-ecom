import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { checkRateLimit } from '@/lib/rate-limit'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (user.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
        if (dbUser?.isBlocked) {
          return false // Block sign in
        }
      }
      return true
    },
  },
  providers: [
    Google,
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data

          // Rate Limit
          const isAllowed = await checkRateLimit(`login:${email}`, 5, 60)
          if (!isAllowed) {
            throw new Error('Too many attempts. Please try again later.')
          }

          const user = await prisma.user.findUnique({ where: { email } })
          if (!user || !user.password) return null

          // Blocked Check
          if (user.isBlocked) {
            throw new Error('User is blocked.')
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) return user
        }

        return null
      },
    }),
    Credentials({
      id: 'otp',
      name: 'OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ phone: z.string().min(10), code: z.string().length(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { phone, code } = parsedCredentials.data

          // Rate Limit
          const isAllowed = await checkRateLimit(`login:${phone}`, 5, 60)
          if (!isAllowed) {
            throw new Error('Too many attempts. Please try again later.')
          }

          // Verify OTP
          const otpRecord = await prisma.otp.findFirst({
            where: { phone, code, expiresAt: { gt: new Date() } },
          })

          if (!otpRecord) return null

          // Find or create user
          let user = await prisma.user.findUnique({ where: { phone } })
          if (!user) {
            user = await prisma.user.create({
              data: { phone },
            })
          }

          // Blocked Check
          if (user.isBlocked) {
            throw new Error('User is blocked.')
          }

          // Delete used OTP
          await prisma.otp.delete({ where: { id: otpRecord.id } })

          return user
        }
        return null
      },
    }),
  ],
})
