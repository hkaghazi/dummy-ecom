import { redis } from '@/lib/redis'

export async function checkRateLimit(key: string, limit: number = 5, windowSeconds: number = 60) {
  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, windowSeconds)
  }

  if (count > limit) {
    return false
  }

  return true
}
