'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Lock,
  MailPlus,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { inquiryService, type InquiryListMeta } from '@/services/inquiryService'
import { categoryToApiKey, INQUIRY_OPTIONS, type InquiryCategory } from './inquiryTypes'
import { INQUIRY_CATEGORY_META } from './inquiryCategoryUi'
import { summarizeInquiryRow } from './inquirySummaries'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InquiryUserPreview = { id?: string; name?: string; email?: string }

export interface InquiryListViewProps {
  mode: 'user' | 'seller'
  basePath: '/user/inquiries' | '/seller/inquiries'
  token: string | null | undefined
  currentUserId: string | null | undefined
}

function ListSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={`sk-${i}`} className="flex gap-4 items-center">
          <div className="h-4 w-12 rounded bg-muted" />
          <div className="h-4 flex-1 max-w-md rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted hidden sm:block" />
          <div className="h-8 w-16 rounded bg-muted ml-auto" />
        </div>
      ))}
    </div>
  )
}

export default function InquiryListView({ mode, basePath, token, currentUserId }: InquiryListViewProps) {
  const [category, setCategory] = useState<InquiryCategory>('diamond')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [meta, setMeta] = useState<InquiryListMeta | null>(null)

  const limit = 10
  const catMeta = INQUIRY_CATEGORY_META[category]
  const CategoryIcon = catMeta.Icon

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false)
      setRows([])
      setMeta(null)
      return
    }
    setLoading(true)
    try {
      const apiKey = categoryToApiKey(category)
      const params = {
        page,
        limit,
        sort: '-createdAt',
        ...(mode === 'user' && currentUserId ? { userId: currentUserId } : {}),
      }
      const res = await inquiryService.list(apiKey, params, token)
      if (!res.success) {
        toast.error(res.message || 'Failed to load inquiries')
        setRows([])
        setMeta(null)
        return
      }
      const payload = res.data as { data?: unknown[]; meta?: InquiryListMeta }
      const list = Array.isArray(payload?.data) ? payload.data : []
      setRows(list as Record<string, unknown>[])
      setMeta(payload?.meta ?? null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load inquiries')
      setRows([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [token, category, page, mode, currentUserId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [category])

  if (!token) {
    return (
      <div
        className={cn(
          'rounded-2xl border p-10 text-center max-w-lg mx-auto',
          'bg-card/80 backdrop-blur-sm shadow-sm',
        )}
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {mode === 'user' ? 'Sign in to see your inquiries' : 'Sign in required'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === 'user'
            ? 'Your submitted product inquiries appear here once you are logged in.'
            : 'Open the seller dashboard after signing in to view the inquiry inbox.'}
        </p>
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    )
  }

  if (mode === 'user' && !currentUserId) {
    return (
      <div
        className="rounded-2xl border p-8 text-center text-sm bg-card shadow-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
      >
        Your account could not be loaded. Try refreshing the page.
      </div>
    )
  }

  const label = INQUIRY_OPTIONS.find((o) => o.value === category)?.label ?? category
  const total = meta?.total ?? 0
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = meta ? Math.min(page * limit, total) : 0

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">Browse by type</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Switch category — each type loads its own list.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-start text-muted-foreground hover:text-foreground gap-1.5"
            disabled={loading}
            onClick={() => load()}
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        <div
          className="flex flex-wrap gap-2 p-1.5 rounded-2xl border bg-muted/30"
          style={{ borderColor: 'var(--border)' }}
          role="tablist"
          aria-label="Inquiry category"
        >
          {INQUIRY_OPTIONS.map((opt) => {
            const m = INQUIRY_CATEGORY_META[opt.value]
            const Icon = m.Icon
            const selected = category === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(opt.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                  'min-h-[44px] touch-manipulation',
                  selected ? m.selectedClass : m.idleClass,
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        className={cn(
          'rounded-2xl border overflow-hidden shadow-sm',
          'bg-card ring-1 ring-black/5 dark:ring-white/10',
        )}
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b"
          style={{
            borderColor: 'var(--border)',
            background: 'linear-gradient(180deg, var(--muted)/0.5, transparent)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60">
              <CategoryIcon className="h-4 w-4 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{label} inquiries</p>
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : meta ? (
                <p className="text-xs text-muted-foreground">
                  {total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {loading ? (
          <ListSkeleton />
        ) : rows.length === 0 ? (
          <div className="px-6 py-16 text-center max-w-md mx-auto">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <Inbox className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">No {label.toLowerCase()} inquiries yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {mode === 'user'
                ? 'When you submit a product inquiry, it will show up here.'
                : 'No leads in this category right now.'}
            </p>
            {mode === 'user' && (
              <Button asChild className="gap-2">
                <Link href="/inquiry">
                  <MailPlus className="h-4 w-4" />
                  Create an inquiry
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                    <th className="text-left p-3 pl-4 font-semibold text-foreground w-[88px]">ID</th>
                    {mode === 'seller' && (
                      <th className="text-left p-3 font-semibold text-foreground min-w-[140px]">Customer</th>
                    )}
                    <th className="text-left p-3 font-semibold text-foreground">Summary</th>
                    <th className="text-left p-3 font-semibold text-foreground whitespace-nowrap w-[160px]">
                      Submitted
                    </th>
                    <th className="p-3 w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const id = row.id as number
                    const created = row.createdAt ? new Date(String(row.createdAt)) : null
                    const createdStr = created
                      ? created.toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : '—'
                    const user = row.user as InquiryUserPreview | undefined
                    const summary = summarizeInquiryRow(category, row)
                    return (
                      <tr
                        key={id}
                        className="border-b transition-colors hover:bg-muted/50"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <td className="p-3 pl-4 align-middle">
                          <span className="font-mono text-xs tabular-nums text-muted-foreground">#{id}</span>
                        </td>
                        {mode === 'seller' && (
                          <td className="p-3 align-middle max-w-[220px]">
                            <span className="line-clamp-2 text-foreground" title={user?.email}>
                              {user?.name || user?.email || '—'}
                            </span>
                            {user?.name && user?.email && (
                              <span className="block text-xs text-muted-foreground truncate">{user.email}</span>
                            )}
                          </td>
                        )}
                        <td className="p-3 align-middle max-w-xl">
                          <span className="line-clamp-2 text-foreground/90" title={summary}>
                            {summary || '—'}
                          </span>
                        </td>
                        <td className="p-3 align-middle text-xs text-muted-foreground whitespace-nowrap">
                          {createdStr}
                        </td>
                        <td className="p-3 align-middle text-right">
                          <Button asChild variant="outline" size="sm" className="font-medium">
                            <Link href={`${basePath}/${category}/${id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y" style={{ borderColor: 'var(--border)' }}>
              {rows.map((row) => {
                const id = row.id as number
                const created = row.createdAt ? new Date(String(row.createdAt)) : null
                const createdStr = created
                  ? created.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                  : '—'
                const user = row.user as InquiryUserPreview | undefined
                const summary = summarizeInquiryRow(category, row)
                return (
                  <div key={id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">#{id}</span>
                      <span className="text-xs text-muted-foreground text-right">{createdStr}</span>
                    </div>
                    {mode === 'seller' && (
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {user?.name || user?.email || '—'}
                      </p>
                    )}
                    <p className="text-sm text-foreground/90 line-clamp-3">{summary || '—'}</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`${basePath}/${category}/${id}`}>View details</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {meta && meta.lastPage > 1 && (
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border px-4 py-3 bg-muted/20"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Page <span className="font-medium text-foreground">{meta.currentPage}</span> of{' '}
            <span className="font-medium text-foreground">{meta.lastPage}</span>
            <span className="hidden sm:inline"> · {total} total</span>
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.prev || loading}
              onClick={() => meta.prev && setPage(meta.prev)}
              className="min-w-[100px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.next || loading}
              onClick={() => meta.next && setPage(meta.next)}
              className="min-w-[100px]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
