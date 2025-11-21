'use server'

import { prisma } from '@/lib/db'

export async function sendOtp(phone: string) {
  // Mock OTP generation
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // In production, send SMS here
  console.log(`Sending OTP ${code} to ${phone}`)

  await prisma.otp.create({
    data: {
      phone,
      code,
      expiresAt,
    },
  })

  return { success: true }
}
