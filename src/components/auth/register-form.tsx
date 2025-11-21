'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/actions/register-action'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const result = await registerUser(formData)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/login')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required placeholder="John Doe" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="m@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <RegisterButton />
      <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}

function RegisterButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  )
}
