'use server'

import { prisma } from '@/lib/db'
import { RegisterSchema } from '@/lib/schemas'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'

export async function registerUser(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password, name } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'Email already in use' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  await signIn('credentials', {
    email,
    password,
    redirectTo: '/admin',
  })

  return { success: 'User created!' }
}
