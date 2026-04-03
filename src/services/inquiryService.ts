import { apiService } from './api'
import type { InquiryApiKey } from '@/components/inquiry/inquiryTypes'

/** POST bodies match be-ohana create DTOs; omit empty optional fields before send. */
export interface InquiryListParams {
  page?: number
  limit?: number
  sort?: string
  /** When set, lists only inquiries created by this user (Prisma `userId` filter). */
  userId?: string
}

function listParamsToQuery(p: InquiryListParams): Record<string, string | number | boolean> {
  const q: Record<string, string | number | boolean> = {}
  if (p.page != null) q.page = p.page
  if (p.limit != null) q.limit = p.limit
  if (p.sort != null && p.sort !== '') q.sort = p.sort
  if (p.userId != null && p.userId !== '') q.userId = p.userId
  return q
}

const PATH: Record<InquiryApiKey, string> = {
  diamond: '/diamond-inquiry',
  gemstone: '/gemstone-inquiry',
  bullion: '/bullion-inquiry',
  watch: '/watch-inquiry',
  jewellery: '/jewellery-inquiry',
}

export const inquiryService = {
  createDiamond: (body: Record<string, unknown>, token: string) =>
    apiService.post('/diamond-inquiry', body, token),

  createGemstone: (body: Record<string, unknown>, token: string) =>
    apiService.post('/gemstone-inquiry', body, token),

  createBullion: (body: Record<string, unknown>, token: string) =>
    apiService.post('/bullion-inquiry', body, token),

  createWatch: (body: Record<string, unknown>, token: string) =>
    apiService.post('/watch-inquiry', body, token),

  createJewellery: (body: Record<string, unknown>, token: string) =>
    apiService.post('/jewellery-inquiry', body, token),

  list: (kind: InquiryApiKey, params: InquiryListParams, token?: string) =>
    apiService.get<{ data: unknown[]; meta: InquiryListMeta }>(
      `${PATH[kind]}/all`,
      listParamsToQuery(params),
      token,
    ),

  getOne: (kind: InquiryApiKey, id: number | string, token?: string) =>
    apiService.get<Record<string, unknown>>(`${PATH[kind]}/${id}`, undefined, token),

  update: (kind: InquiryApiKey, id: number | string, body: Record<string, unknown>, token: string) =>
    apiService.patch(`${PATH[kind]}/${id}`, body, token),

  delete: (kind: InquiryApiKey, id: number | string, token: string) =>
    apiService.delete(`${PATH[kind]}/${id}`, token),
}

/** Matches prisma pagination meta from be-ohana */
export interface InquiryListMeta {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev: number | null
  next: number | null
}
