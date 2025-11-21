import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      roleId?: string | null
    } & DefaultSession['user']
  }

  interface User {
    roleId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roleId?: string | null
  }
}
