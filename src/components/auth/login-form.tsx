'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authenticate, authenticateOtp } from '@/actions/auth-actions'
import { sendOtp } from '@/actions/otp-action'
import { useState, useTransition } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { LoginSchema, LoginOtpSchema } from '@/lib/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<'credentials' | 'otp'>('credentials')
  const [otpSent, setOtpSent] = useState(false)

  const formCredentials = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const formOtp = useForm<z.infer<typeof LoginOtpSchema>>({
    resolver: zodResolver(LoginOtpSchema),
    defaultValues: {
      phone: '',
      code: '',
    },
  })

  const onCredentialsSubmit = (values: z.infer<typeof LoginSchema>) => {
    setErrorMessage(undefined)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      const error = await authenticate(undefined, formData)
      if (error) {
        setErrorMessage(error)
      }
    })
  }

  const onOtpSubmit = (values: z.infer<typeof LoginOtpSchema>) => {
    setOtpErrorMessage(undefined)
    if (!otpSent) {
      // Send OTP
      startTransition(async () => {
        await sendOtp(values.phone)
        setOtpSent(true)
      })
    } else {
      // Verify OTP
      startTransition(async () => {
        const formData = new FormData()
        formData.append('phone', values.phone)
        if (values.code) {
          formData.append('code', values.code)
        }
        const error = await authenticateOtp(undefined, formData)
        if (error) {
          setOtpErrorMessage(error)
        }
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-center space-x-4">
        <Button
          variant={mode === 'credentials' ? 'default' : 'outline'}
          onClick={() => setMode('credentials')}
          type="button"
        >
          Email
        </Button>
        <Button
          variant={mode === 'otp' ? 'default' : 'outline'}
          onClick={() => setMode('otp')}
          type="button"
        >
          Phone
        </Button>
      </div>

      {mode === 'credentials' ? (
        <Form {...formCredentials}>
          <form onSubmit={formCredentials.handleSubmit(onCredentialsSubmit)} className="space-y-4">
            <FormField
              control={formCredentials.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      type="email"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formCredentials.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            </div>
          </form>
        </Form>
      ) : (
        <Form {...formOtp}>
          <form onSubmit={formOtp.handleSubmit(onOtpSubmit)} className="space-y-4">
            <FormField
              control={formOtp.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567890"
                      type="tel"
                      {...field}
                      disabled={isPending || otpSent}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {otpSent && (
              <FormField
                control={formOtp.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {otpSent
                ? isPending
                  ? 'Logging in...'
                  : 'Login'
                : isPending
                  ? 'Sending OTP...'
                  : 'Send OTP'}
            </Button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              {otpErrorMessage && <p className="text-sm text-red-500">{otpErrorMessage}</p>}
            </div>
          </form>
        </Form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" type="button" className="w-full" onClick={() => signIn('google')}>
        <FcGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  )
}
