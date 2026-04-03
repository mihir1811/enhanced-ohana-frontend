import { getCookie } from '@/lib/cookie-utils'

export function getInquiryAuthToken(): string | undefined {
  return getCookie('token')
}

/** Parse text input to a finite number; empty or invalid → undefined (omit from payload). */
export function parseFiniteNumber(raw: string): number | undefined {
  const t = raw.trim()
  if (t === '') return undefined
  const n = Number(t)
  return Number.isFinite(n) ? n : undefined
}

/** Optional whole number (e.g. quantity with @IsInt() on API). */
export function parseOptionalInt(raw: string): number | undefined {
  const t = raw.trim()
  if (t === '') return undefined
  const n = Number(t)
  if (!Number.isFinite(n) || !Number.isInteger(n)) return undefined
  return n
}

/** Remove empty strings / undefined / null so backend validation stays happy */
export function cleanInquiryPayload<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue
    if (typeof v === 'number' && Number.isNaN(v)) continue
    out[k] = v
  }
  return out
}
