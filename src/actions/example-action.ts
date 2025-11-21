'use server'

// import { prisma } from '@/lib/db'

export async function getExampleData() {
  // Example action
  return { message: 'Hello from server action' }
}

export async function createUser(_name: string, _email: string) {
  // Example DB operation
  // const user = await prisma.user.create({ data: { name, email } })
  // return user
  return { success: true }
}
