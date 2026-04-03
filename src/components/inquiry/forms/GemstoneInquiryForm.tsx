'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inquiryService } from '@/services/inquiryService'
import {
  cleanInquiryPayload,
  getInquiryAuthToken,
  parseFiniteNumber,
  parseOptionalInt,
} from '../inquiryFormUtils'

const GEMSTONE_TYPES = ['Ruby', 'Sapphire', 'Emerald', 'Spinel', 'Tourmaline'] as const
const SHAPES = ['Round', 'Oval', 'Cushion', 'Pear', 'Emerald'] as const
const COLORS = ['Red', 'Blue', 'Green', 'Pink', 'Yellow'] as const
const CLARITIES = ['Eye Clean', 'VS', 'SI'] as const
const ORIGINS = ['Burma', 'Sri Lanka', 'Mozambique', 'Madagascar'] as const
const TREATMENTS = ['Heated', 'Unheated', 'Minor Oil'] as const
const CERT_COMPANIES = ['GIA', 'IGI', 'GRS'] as const
const PAYMENT_TERMS = ['COD', '21 Days', 'Advance 50%'] as const

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function addOptionalNumber(body: Record<string, unknown>, key: string, raw: string) {
  const n = parseFiniteNumber(raw)
  if (n !== undefined) body[key] = n
}

export default function GemstoneInquiryForm() {
  const token = getInquiryAuthToken()
  const [loading, setLoading] = useState(false)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [isCertified, setIsCertified] = useState(false)
  const [certificateCompany, setCertificateCompany] = useState('')
  const [gemstoneType, setGemstoneType] = useState('Ruby')
  const [shape, setShape] = useState('Round')
  const [primaryColorMin, setPrimaryColorMin] = useState('')
  const [primaryColorMax, setPrimaryColorMax] = useState('')
  const [clarity, setClarity] = useState('')
  const [caratWeightMin, setCaratWeightMin] = useState('1')
  const [caratWeightMax, setCaratWeightMax] = useState('2')
  const [origin, setOrigin] = useState('')
  const [treatment, setTreatment] = useState('')
  const [quantity, setQuantity] = useState('')
  const [totalPriceMin, setTotalPriceMin] = useState('')
  const [totalPriceMax, setTotalPriceMax] = useState('')
  const [pricePerCaratMin, setPricePerCaratMin] = useState('')
  const [pricePerCaratMax, setPricePerCaratMax] = useState('')
  const [description, setDescription] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [lengthMin, setLengthMin] = useState('')
  const [lengthMax, setLengthMax] = useState('')
  const [widthMin, setWidthMin] = useState('')
  const [widthMax, setWidthMax] = useState('')
  const [heightMin, setHeightMin] = useState('')
  const [heightMax, setHeightMax] = useState('')
  const [urgency, setUrgency] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')

  const fillRandomData = () => {
    setSubmitSuccessMessage('')
    setHasUnsavedChanges(true)

    const certified = Math.random() > 0.5
    const minCarat = (Math.random() * 2 + 0.5).toFixed(2)
    const maxCarat = (Number(minCarat) + Math.random() * 2 + 0.3).toFixed(2)
    const minTotal = Math.floor(Math.random() * 20000 + 10000)
    const maxTotal = minTotal + Math.floor(Math.random() * 15000 + 2000)
    const minPpc = Math.floor(Math.random() * 6000 + 3000)
    const maxPpc = minPpc + Math.floor(Math.random() * 2000 + 500)
    const urgencyDate = new Date()
    urgencyDate.setDate(urgencyDate.getDate() + Math.floor(Math.random() * 30 + 3))

    setIsCertified(certified)
    setCertificateCompany(certified ? pick(CERT_COMPANIES) : '')
    setGemstoneType(pick(GEMSTONE_TYPES))
    setShape(pick(SHAPES))
    setPrimaryColorMin(pick(COLORS))
    setPrimaryColorMax(pick(COLORS))
    setClarity(pick(CLARITIES))
    setCaratWeightMin(minCarat)
    setCaratWeightMax(maxCarat)
    setOrigin(pick(ORIGINS))
    setTreatment(pick(TREATMENTS))
    setQuantity(String(Math.floor(Math.random() * 10 + 1)))
    setTotalPriceMin(String(minTotal))
    setTotalPriceMax(String(maxTotal))
    setPricePerCaratMin(String(minPpc))
    setPricePerCaratMax(String(maxPpc))
    setDescription('Test gemstone inquiry generated from random fill button.')
    setPaymentTerms(pick(PAYMENT_TERMS))
    setLengthMin('5.5')
    setLengthMax('5.8')
    setWidthMin('3.2')
    setWidthMax('3.4')
    setHeightMin('2.1')
    setHeightMax('2.6')
    setUrgency(urgencyDate.toISOString().split('T')[0])
    setImageUrl('https://example.com/image.jpg')
    setDeliveryLocation('Surat')

    toast.success('Random test data filled.')
  }

  const resetForm = () => {
    setIsCertified(false)
    setCertificateCompany('')
    setGemstoneType('Ruby')
    setShape('Round')
    setPrimaryColorMin('')
    setPrimaryColorMax('')
    setClarity('')
    setCaratWeightMin('1')
    setCaratWeightMax('2')
    setOrigin('')
    setTreatment('')
    setQuantity('')
    setTotalPriceMin('')
    setTotalPriceMax('')
    setPricePerCaratMin('')
    setPricePerCaratMax('')
    setDescription('')
    setPaymentTerms('')
    setLengthMin('')
    setLengthMax('')
    setWidthMin('')
    setWidthMax('')
    setHeightMin('')
    setHeightMax('')
    setUrgency('')
    setImageUrl('')
    setDeliveryLocation('')
    setHasUnsavedChanges(false)
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
    if (isCertified && !certificateCompany.trim()) {
      toast.error('certificateCompany is required when isCertified is true.')
      return
    }

    const caratMinN = parseFiniteNumber(caratWeightMin)
    const caratMaxN = parseFiniteNumber(caratWeightMax)
    if (caratMinN === undefined || caratMaxN === undefined) {
      toast.error('caratWeightMin and caratWeightMax must be valid numbers.')
      return
    }

    if (quantity.trim() !== '') {
      const q = parseOptionalInt(quantity)
      if (q === undefined) {
        toast.error('quantity must be a whole number.')
        return
      }
    }

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        gemstoneType: gemstoneType.trim(),
        shape: shape.trim(),
        caratWeightMin: caratMinN,
        caratWeightMax: caratMaxN,
      }

      if (isCertified) {
        body.isCertified = true
        body.certificateCompany = certificateCompany.trim()
      }
      if (primaryColorMin.trim()) body.primaryColorMin = primaryColorMin.trim()
      if (primaryColorMax.trim()) body.primaryColorMax = primaryColorMax.trim()
      if (clarity.trim()) body.clarity = clarity.trim()
      if (origin.trim()) body.origin = origin.trim()
      if (treatment.trim()) body.treatment = treatment.trim()
      const qty = parseOptionalInt(quantity)
      if (qty !== undefined) body.quantity = qty
      addOptionalNumber(body, 'totalPriceMin', totalPriceMin)
      addOptionalNumber(body, 'totalPriceMax', totalPriceMax)
      addOptionalNumber(body, 'pricePerCaratMin', pricePerCaratMin)
      addOptionalNumber(body, 'pricePerCaratMax', pricePerCaratMax)
      if (description.trim()) body.description = description.trim()
      if (paymentTerms.trim()) body.paymentTerms = paymentTerms.trim()
      addOptionalNumber(body, 'lengthMin', lengthMin)
      addOptionalNumber(body, 'lengthMax', lengthMax)
      addOptionalNumber(body, 'widthMin', widthMin)
      addOptionalNumber(body, 'widthMax', widthMax)
      addOptionalNumber(body, 'heightMin', heightMin)
      addOptionalNumber(body, 'heightMax', heightMax)
      if (urgency) body.urgency = new Date(urgency).toISOString()
      if (imageUrl.trim()) body.imageUrl = imageUrl.trim()
      if (deliveryLocation.trim()) body.deliveryLocation = deliveryLocation.trim()

      const res = await inquiryService.createGemstone(cleanInquiryPayload(body), token)
      if (res.success) {
        const message = res.message || 'Gemstone inquiry submitted successfully.'
        toast.success(message)
        setSubmitSuccessMessage(message)
        resetForm()
      } else {
        toast.error(res.message || 'Request failed.')
      }
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

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Certification</p>
        <div className="flex items-center gap-2">
          <input
            id="gem-isCertified"
            type="checkbox"
            checked={isCertified}
            onChange={(e) => setIsCertified(e.target.checked)}
            className="rounded border-input"
          />
          <Label htmlFor="gem-isCertified" className="font-normal cursor-pointer">
            isCertified
          </Label>
        </div>
        {isCertified && (
          <div className="space-y-2">
            <Label htmlFor="gem-certificateCompany">certificateCompany</Label>
            <Input
              id="gem-certificateCompany"
              value={certificateCompany}
              onChange={(e) => setCertificateCompany(e.target.value)}
              placeholder="GIA"
              required
            />
          </div>
        )}
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Gemstone</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-gemstoneType">gemstoneType</Label>
            <Input id="gem-gemstoneType" value={gemstoneType} onChange={(e) => setGemstoneType(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-shape">shape</Label>
            <Input id="gem-shape" value={shape} onChange={(e) => setShape(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-caratWeightMin">caratWeightMin</Label>
            <Input
              id="gem-caratWeightMin"
              type="number"
              step="any"
              value={caratWeightMin}
              onChange={(e) => setCaratWeightMin(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-caratWeightMax">caratWeightMax</Label>
            <Input
              id="gem-caratWeightMax"
              type="number"
              step="any"
              value={caratWeightMax}
              onChange={(e) => setCaratWeightMax(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-primaryColorMin">primaryColorMin</Label>
            <Input id="gem-primaryColorMin" value={primaryColorMin} onChange={(e) => setPrimaryColorMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-primaryColorMax">primaryColorMax</Label>
            <Input id="gem-primaryColorMax" value={primaryColorMax} onChange={(e) => setPrimaryColorMax(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gem-clarity">clarity</Label>
          <Input id="gem-clarity" value={clarity} onChange={(e) => setClarity(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-origin">origin</Label>
            <Input id="gem-origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-treatment">treatment</Label>
            <Input id="gem-treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Commercial</p>
        <div className="space-y-2">
          <Label htmlFor="gem-quantity">quantity</Label>
          <Input id="gem-quantity" type="number" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-totalPriceMin">totalPriceMin</Label>
            <Input id="gem-totalPriceMin" type="number" step="any" value={totalPriceMin} onChange={(e) => setTotalPriceMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-totalPriceMax">totalPriceMax</Label>
            <Input id="gem-totalPriceMax" type="number" step="any" value={totalPriceMax} onChange={(e) => setTotalPriceMax(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-pricePerCaratMin">pricePerCaratMin</Label>
            <Input id="gem-pricePerCaratMin" type="number" step="any" value={pricePerCaratMin} onChange={(e) => setPricePerCaratMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-pricePerCaratMax">pricePerCaratMax</Label>
            <Input id="gem-pricePerCaratMax" type="number" step="any" value={pricePerCaratMax} onChange={(e) => setPricePerCaratMax(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gem-description">description</Label>
          <textarea
            id="gem-description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gem-paymentTerms">paymentTerms</Label>
          <Input id="gem-paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Dimensions</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-lengthMin">lengthMin</Label>
            <Input id="gem-lengthMin" type="number" step="any" value={lengthMin} onChange={(e) => setLengthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-lengthMax">lengthMax</Label>
            <Input id="gem-lengthMax" type="number" step="any" value={lengthMax} onChange={(e) => setLengthMax(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-widthMin">widthMin</Label>
            <Input id="gem-widthMin" type="number" step="any" value={widthMin} onChange={(e) => setWidthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-widthMax">widthMax</Label>
            <Input id="gem-widthMax" type="number" step="any" value={widthMax} onChange={(e) => setWidthMax(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-heightMin">heightMin</Label>
            <Input id="gem-heightMin" type="number" step="any" value={heightMin} onChange={(e) => setHeightMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-heightMax">heightMax</Label>
            <Input id="gem-heightMax" type="number" step="any" value={heightMax} onChange={(e) => setHeightMax(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Logistics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gem-urgency">urgency</Label>
            <Input id="gem-urgency" type="date" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gem-imageUrl">imageUrl</Label>
            <Input id="gem-imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gem-deliveryLocation">deliveryLocation</Label>
          <Input id="gem-deliveryLocation" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
        </div>
      </section>

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
            {loading ? 'Submitting your inquiry…' : 'Submit gemstone inquiry'}
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Submit is enabled after you make changes.
        </p>
      </div>
    </form>
  )
}
