'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inquiryService } from '@/services/inquiryService'
import { cleanInquiryPayload, getInquiryAuthToken, parseFiniteNumber } from '../inquiryFormUtils'

const MOVEMENT_TYPES = [
  'AUTOMATIC',
  'MANUAL',
  'QUARTZ',
] as const
const WATCH_BRANDS = ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Cartier'] as const
const CASE_MATERIALS = ['Stainless Steel', 'Titanium', 'Gold', 'Ceramic'] as const
const DIAL_COLORS = ['Black', 'Blue', 'White', 'Green'] as const
const STRAP_MATERIALS = ['Steel', 'Leather', 'Rubber', 'NATO'] as const
const CONDITIONS = ['New', 'Used', 'Like New'] as const

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function addOptionalNumber(body: Record<string, unknown>, key: string, raw: string) {
  const n = parseFiniteNumber(raw)
  if (n !== undefined) body[key] = n
}

export default function WatchInquiryForm() {
  const token = getInquiryAuthToken()
  const [loading, setLoading] = useState(false)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [totalPriceMin, setTotalPriceMin] = useState('')
  const [totalPriceMax, setTotalPriceMax] = useState('')
  const [caseMaterial, setCaseMaterial] = useState('')
  const [caseSizeMin, setCaseSizeMin] = useState('')
  const [caseSizeMax, setCaseSizeMax] = useState('')
  const [dialColor, setDialColor] = useState('')
  const [strapMaterial, setStrapMaterial] = useState('')
  const [movement, setMovement] = useState<string>('')
  const [hasOriginalBox, setHasOriginalBox] = useState(false)
  const [hasWarrantyPapers, setHasWarrantyPapers] = useState(false)
  const [hasManuals, setHasManuals] = useState(false)
  const [condition, setCondition] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')

  const resetForm = () => {
    setBrand('')
    setModel('')
    setReferenceNumber('')
    setYearMin('')
    setYearMax('')
    setTotalPriceMin('')
    setTotalPriceMax('')
    setCaseMaterial('')
    setCaseSizeMin('')
    setCaseSizeMax('')
    setDialColor('')
    setStrapMaterial('')
    setMovement('')
    setHasOriginalBox(false)
    setHasWarrantyPapers(false)
    setHasManuals(false)
    setCondition('')
    setDescription('')
    setUrgency('')
    setImageUrl('')
    setDeliveryLocation('')
    setHasUnsavedChanges(false)
  }

  const fillRandomData = () => {
    setSubmitSuccessMessage('')
    setHasUnsavedChanges(true)

    const minYear = Math.floor(Math.random() * 15 + 2008)
    const maxYear = minYear + Math.floor(Math.random() * 8 + 1)
    const minPrice = Math.floor(Math.random() * 300000 + 250000)
    const maxPrice = minPrice + Math.floor(Math.random() * 400000 + 50000)
    const minCase = (Math.random() * 4 + 38).toFixed(1)
    const maxCase = (Number(minCase) + Math.random() * 3 + 0.5).toFixed(1)
    const urgencyDate = new Date()
    urgencyDate.setDate(urgencyDate.getDate() + Math.floor(Math.random() * 30 + 3))

    setBrand(pick(WATCH_BRANDS))
    setModel('Submariner')
    setReferenceNumber('N9548D')
    setYearMin(String(minYear))
    setYearMax(String(maxYear))
    setTotalPriceMin(String(minPrice))
    setTotalPriceMax(String(maxPrice))
    setCaseMaterial(pick(CASE_MATERIALS))
    setCaseSizeMin(String(minCase))
    setCaseSizeMax(String(maxCase))
    setDialColor(pick(DIAL_COLORS))
    setStrapMaterial(pick(STRAP_MATERIALS))
    setMovement(pick(MOVEMENT_TYPES))
    setHasOriginalBox(Math.random() > 0.4)
    setHasWarrantyPapers(Math.random() > 0.4)
    setHasManuals(Math.random() > 0.5)
    setCondition(pick(CONDITIONS))
    setDescription('Looking for a well-maintained luxury watch.')
    setUrgency(urgencyDate.toISOString().split('T')[0])
    setImageUrl('https://example.com/watch.jpg')
    setDeliveryLocation('Surat')

    toast.success('Random test data filled.')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setSubmitSuccessMessage('')
    if (!hasUnsavedChanges) {
      toast('No new changes to submit.')
      return
    }
    if (!token) {
      toast.error('Please log in to submit an inquiry.')
      return
    }
    if (!brand.trim()) {
      toast.error('Brand is required.')
      return
    }
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        brand: brand.trim(),
      }
      if (model.trim()) body.model = model.trim()
      if (referenceNumber.trim()) body.referenceNumber = referenceNumber.trim()
      addOptionalNumber(body, 'yearMin', yearMin)
      addOptionalNumber(body, 'yearMax', yearMax)
      addOptionalNumber(body, 'totalPriceMin', totalPriceMin)
      addOptionalNumber(body, 'totalPriceMax', totalPriceMax)
      if (caseMaterial.trim()) body.caseMaterial = caseMaterial.trim()
      addOptionalNumber(body, 'caseSizeMin', caseSizeMin)
      addOptionalNumber(body, 'caseSizeMax', caseSizeMax)
      if (dialColor.trim()) body.dialColor = dialColor.trim()
      if (strapMaterial.trim()) body.strapMaterial = strapMaterial.trim()
      if (movement) body.movement = movement
      body.hasOriginalBox = hasOriginalBox
      body.hasWarrantyPapers = hasWarrantyPapers
      body.hasManuals = hasManuals
      if (condition.trim()) body.condition = condition.trim()
      if (description.trim()) body.description = description.trim()
      if (urgency) body.urgency = new Date(urgency).toISOString()
      if (imageUrl.trim()) body.imageUrl = imageUrl.trim()
      if (deliveryLocation.trim()) body.deliveryLocation = deliveryLocation.trim()

      const res = await inquiryService.createWatch(cleanInquiryPayload(body), token)
      if (res.success) {
        const message = res.message || 'Watch inquiry submitted successfully.'
        toast.success(message)
        setSubmitSuccessMessage(message)
        resetForm()
      } else toast.error(res.message || 'Request failed.')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <p className="text-sm rounded-lg border p-4" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        You need to be logged in to submit a product inquiry.{' '}
        <Link href="/login" className="font-medium underline" style={{ color: 'var(--primary)' }}>
          Log in
        </Link>
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => {
        if (submitSuccessMessage) setSubmitSuccessMessage('')
        setHasUnsavedChanges(true)
      }}
      className="space-y-5"
    >
      {submitSuccessMessage && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
        >
          {submitSuccessMessage}
        </div>
      )}

      <div className="space-y-2">
        <Label>brand</Label>
        <Input value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="Rolex" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>model</Label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>referenceNumber</Label>
          <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>yearMin</Label>
          <Input type="number" step="any" value={yearMin} onChange={(e) => setYearMin(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>yearMax</Label>
          <Input type="number" step="any" value={yearMax} onChange={(e) => setYearMax(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>totalPriceMin</Label>
          <Input type="number" step="any" value={totalPriceMin} onChange={(e) => setTotalPriceMin(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>totalPriceMax</Label>
          <Input type="number" step="any" value={totalPriceMax} onChange={(e) => setTotalPriceMax(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>caseMaterial</Label>
          <Input value={caseMaterial} onChange={(e) => setCaseMaterial(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>dialColor</Label>
          <Input value={dialColor} onChange={(e) => setDialColor(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>caseSizeMin</Label>
          <Input type="number" step="any" value={caseSizeMin} onChange={(e) => setCaseSizeMin(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>caseSizeMax</Label>
          <Input type="number" step="any" value={caseSizeMax} onChange={(e) => setCaseSizeMax(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>strapMaterial</Label>
        <Input value={strapMaterial} onChange={(e) => setStrapMaterial(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>movement</Label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={movement}
          onChange={(e) => setMovement(e.target.value)}
        >
          <option value="">—</option>
          {MOVEMENT_TYPES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasOriginalBox} onChange={(e) => setHasOriginalBox(e.target.checked)} />
          hasOriginalBox
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasWarrantyPapers} onChange={(e) => setHasWarrantyPapers(e.target.checked)} />
          hasWarrantyPapers
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasManuals} onChange={(e) => setHasManuals(e.target.checked)} />
          hasManuals
        </label>
      </div>

      <div className="space-y-2">
        <Label>condition</Label>
        <Input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="New / Used" />
      </div>

      <div className="space-y-2">
        <Label>urgency</Label>
        <Input type="date" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>imageUrl</Label>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>deliveryLocation</Label>
        <Input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>description</Label>
        <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="rounded-lg border bg-muted/30 dark:bg-muted/20 p-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={fillRandomData}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Fill random data
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading || !hasUnsavedChanges}
              className="w-full sm:w-auto bg-background/80 dark:bg-background/40"
            >
              Reset form
            </Button>
          </div>
          <Button
            type="submit"
            disabled={loading || !hasUnsavedChanges}
            className="w-full sm:w-auto sm:min-w-[220px] font-semibold shadow-sm border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Submitting your inquiry…' : 'Submit watch inquiry'}
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Submit is enabled after you make changes.
        </p>
      </div>
    </form>
  )
}
