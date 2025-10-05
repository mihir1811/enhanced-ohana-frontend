// Chat normalization helpers to reduce repeated code across chat pages
export type NormalizedMessage = {
  id: string
  fromId?: string
  toId?: string
  text: string
  timestamp: number
  fromRole?: string
  toRole?: string
}

export const extractMessageArray = (raw: any): any[] => {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.data?.data)) return raw.data.data
  return []
}

export const normalizeMessageDto = (dto: any): NormalizedMessage => {
  const fromId = String(dto?.fromUserId ?? dto?.fromId ?? dto?.from?.id ?? '') || undefined
  const toId = String(dto?.toUserId ?? dto?.toId ?? dto?.to?.id ?? '') || undefined
  const text = dto?.text ?? dto?.message ?? ''
  const timestamp = dto?.timestamp ?? (dto?.createdAt ? Date.parse(dto.createdAt) : Date.now())
  const fromRole = dto?.from?.role || undefined
  const toRole = dto?.to?.role || undefined
  return {
    id: String(dto?.id ?? `${fromId}-${timestamp}`),
    fromId,
    toId,
    text,
    timestamp,
    fromRole,
    toRole,
  }
}