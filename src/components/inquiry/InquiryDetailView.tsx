'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Database,
  FileText,
  Loader2,
  Mail,
  Trash2,
  User,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { inquiryService } from '@/services/inquiryService'
import type { InquiryCategory } from './inquiryTypes'
import { categoryToApiKey } from './inquiryTypes'
import { INQUIRY_DTO_FIELDS, INQUIRY_METADATA_FIELDS } from './inquiryDtoFields'
import { INQUIRY_CATEGORY_META } from './inquiryCategoryUi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function formatInquiryValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') {
    if (value instanceof Date) return value.toLocaleString()
    try {
      return JSON.stringify(value, null, 0)
    } catch {
      return String(value)
    }
  }
  if (key === 'createdAt' || key === 'updatedAt' || key === 'urgency') {
    const d = new Date(String(value))
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString()
  }
  return String(value)
}

function renderFieldValue(key: string, value: unknown): ReactNode {
  const text = formatInquiryValue(key, value)
  const isUrl =
    typeof value === 'string' &&
    (key.toLowerCase().includes('url') || key === 'referenceImage' || key === 'referenceVideo') &&
    /^https?:\/\//i.test(value.trim())
  if (isUrl && text !== '—') {
    return (
      <a
        href={value as string}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium underline underline-offset-2 break-all hover:opacity-90"
        style={{ color: 'var(--primary)' }}
      >
        {text}
      </a>
    )
  }
  return <span className="text-foreground/95">{text}</span>
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="h-10 w-48 rounded-lg bg-muted" />
      <div className="h-24 rounded-2xl bg-muted" />
      <div className="h-64 rounded-2xl bg-muted" />
      <div className="h-32 rounded-2xl bg-muted" />
    </div>
  )
}

export interface InquiryDetailViewProps {
  mode: 'user' | 'seller'
  category: InquiryCategory
  id: number
  listHref: string
  token: string | null | undefined
  currentUserId: string | null | undefined
}

export default function InquiryDetailView({
  mode,
  category,
  id,
  listHref,
  token,
  currentUserId,
}: InquiryDetailViewProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [record, setRecord] = useState<Record<string, unknown> | null>(null)

  const apiKey = categoryToApiKey(category)
  const catMeta = INQUIRY_CATEGORY_META[category]
  const CategoryIcon = catMeta.Icon

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await inquiryService.getOne(apiKey, id, token ?? undefined)
      if (!res.success || !res.data) {
        toast.error(res.message || 'Inquiry not found')
        setRecord(null)
        return
      }
      setRecord(res.data as Record<string, unknown>)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load inquiry')
      setRecord(null)
    } finally {
      setLoading(false)
    }
  }, [apiKey, id, token])

  useEffect(() => {
    load()
  }, [load])

  const ownerId = record?.userId != null ? String(record.userId) : null
  const userBlock = record?.user as { name?: string; email?: string } | undefined

  const canDelete =
    !!token &&
    (mode === 'seller' || (mode === 'user' && currentUserId != null && ownerId === currentUserId))

  const handleDelete = async () => {
    if (!token || !canDelete) return
    if (!window.confirm('Delete this inquiry? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await inquiryService.delete(apiKey, id, token)
      if (res.success) {
        toast.success(res.message || 'Inquiry deleted')
        router.push(listHref)
        router.refresh()
      } else {
        toast.error(res.message || 'Delete failed')
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <DetailSkeleton />
  }

  if (!record) {
    return (
      <div
        className={cn(
          'rounded-2xl border p-10 text-center space-y-4 max-w-md mx-auto',
          'bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10',
        )}
        style={{ borderColor: 'var(--border)' }}
      >
        <p className="text-muted-foreground">We could not load this inquiry.</p>
        <Button asChild variant="outline">
          <Link href={listHref}>Back to list</Link>
        </Button>
      </div>
    )
  }

  const dtoFields = INQUIRY_DTO_FIELDS[category]
  const createdAt = record.createdAt ? new Date(String(record.createdAt)) : null
  const createdLabel = createdAt
    ? createdAt.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })
    : null

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 w-fit text-muted-foreground hover:text-foreground">
          <Link href={listHref}>
            <ArrowLeft className="w-4 h-4" />
            All inquiries
          </Link>
        </Button>
        {canDelete && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-2 sm:ml-auto w-full sm:w-auto"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete inquiry
          </Button>
        )}
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border p-6 sm:p-8',
          'bg-gradient-to-br from-card to-muted/20 shadow-sm ring-1 ring-black/5 dark:ring-white/10',
        )}
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4 min-w-0">
            <div
              className={cn(
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2',
                catMeta.selectedClass,
              )}
            >
              <CategoryIcon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {catMeta.label} inquiry
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                #{id}
              </h2>
              {createdLabel && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {createdLabel}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {mode === 'seller' && userBlock && (userBlock.name || userBlock.email) && (
        <div
          className={cn(
            'rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4',
            'bg-muted/30 ring-1 ring-black/5 dark:ring-white/5',
          )}
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-background"
            style={{ borderColor: 'var(--border)' }}
          >
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Customer</p>
            <p className="text-base font-semibold text-foreground truncate">{userBlock.name || '—'}</p>
            {userBlock.email && (
              <a
                href={`mailto:${userBlock.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-1"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {userBlock.email}
              </a>
            )}
          </div>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inquiry details</h3>
            <p className="text-sm text-muted-foreground">Specifications from your submission (create-inquiry API).</p>
          </div>
        </div>

        <div
          className={cn(
            'rounded-2xl border overflow-hidden shadow-sm',
            'ring-1 ring-black/5 dark:ring-white/10',
          )}
          style={{ borderColor: 'var(--border)' }}
        >
          <dl>
            {dtoFields.map(({ key, label }, index) => (
              <div
                key={key}
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-[minmax(0,280px)_1fr] gap-1 sm:gap-6 px-4 py-3.5 sm:px-5 text-sm',
                  'border-b last:border-b-0',
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/25',
                )}
                style={{ borderColor: 'var(--border)' }}
              >
                <dt className="font-medium text-muted-foreground sm:pt-0.5">{label}</dt>
                <dd className="break-words min-w-0">{renderFieldValue(key, record[key])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Record</h3>
            <p className="text-sm text-muted-foreground">System identifiers and timestamps.</p>
          </div>
        </div>

        <div
          className={cn(
            'rounded-2xl border overflow-hidden shadow-sm',
            'ring-1 ring-black/5 dark:ring-white/10',
          )}
          style={{ borderColor: 'var(--border)' }}
        >
          <dl>
            {INQUIRY_METADATA_FIELDS.map(({ key, label }, index) => (
              <div
                key={key}
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-[minmax(0,280px)_1fr] gap-1 sm:gap-6 px-4 py-3.5 sm:px-5 text-sm',
                  'border-b last:border-b-0',
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/25',
                )}
                style={{ borderColor: 'var(--border)' }}
              >
                <dt className="font-medium text-muted-foreground sm:pt-0.5">{label}</dt>
                <dd className="break-words min-w-0 font-mono text-xs sm:text-sm">{renderFieldValue(key, record[key])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}
