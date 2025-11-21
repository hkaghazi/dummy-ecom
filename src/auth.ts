import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
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
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user || !user.password) return null
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

          // Delete used OTP
          await prisma.otp.delete({ where: { id: otpRecord.id } })

          return user
        }
        return null
      },
    }),
  ],
})
