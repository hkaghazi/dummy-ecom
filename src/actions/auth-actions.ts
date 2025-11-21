'use server'

import { signIn } from '@/auth'
import { LoginOtpSchema, LoginSchema } from '@/lib/schemas'
import { AuthError } from 'next-auth'

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const validatedFields = LoginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    console.debug(validatedFields)
    if (!validatedFields.success) {
      return 'Invalid email or password format.'
    }
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function authenticateOtp(prevState: string | undefined, formData: FormData) {
  try {
    const validatedFields = LoginOtpSchema.safeParse({
      phone: formData.get('phone'),
      code: formData.get('code'),
    })

    if (!validatedFields.success) {
      return 'Invalid phone number or code format.'
    }
    await signIn('otp', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid code.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
