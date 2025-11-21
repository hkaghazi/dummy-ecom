'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authenticate, authenticateOtp } from '@/actions/auth-actions'
import { sendOtp } from '@/actions/otp-action'
import { useActionState, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [otpErrorMessage, dispatchOtp] = useActionState(authenticateOtp, undefined)
  const [mode, setMode] = useState<'credentials' | 'otp'>('credentials')
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')

  const handleSendOtp = async () => {
    if (phone.length >= 10) {
      await sendOtp(phone)
      setOtpSent(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-center space-x-4">
        <Button
          variant={mode === 'credentials' ? 'default' : 'outline'}
          onClick={() => setMode('credentials')}
        >
          Email
        </Button>
        <Button variant={mode === 'otp' ? 'default' : 'outline'} onClick={() => setMode('otp')}>
          Phone
        </Button>
      </div>

      {mode === 'credentials' ? (
        <form key="credentials" action={dispatch} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="m@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <LoginButton />
          <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>
        </form>
      ) : (
        <form key="otp" action={dispatchOtp} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
            />
          </div>
          {otpSent && (
            <div>
              <Label htmlFor="code">OTP Code</Label>
              <Input id="code" name="code" type="text" required placeholder="123456" />
            </div>
          )}
          {!otpSent ? (
            <Button type="button" onClick={handleSendOtp} className="w-full">
              Send OTP
            </Button>
          ) : (
            <LoginButton />
          )}
          <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            {otpErrorMessage && <p className="text-sm text-red-500">{otpErrorMessage}</p>}
          </div>
        </form>
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

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? 'Logging in...' : 'Log in'}
    </Button>
  )
}
