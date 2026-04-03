'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inquiryService } from '@/services/inquiryService'
import { cleanInquiryPayload, getInquiryAuthToken, parseFiniteNumber } from '../inquiryFormUtils'

const METAL_TYPES = ['Gold', 'Silver', 'Platinum'] as const
const METAL_FINENESS = ['24KT', '22KT', '999', '995'] as const
const SHAPE_FORMATS = ['Coin', 'Bar', 'Biscuit'] as const
const CERT_COMPANIES = ['BIS Hallmark', 'LBMA', 'MMTC'] as const
const MINTS = ['Suisse', 'Valcambi', 'Perth Mint', 'Royal Mint'] as const
const PAYMENT_TERMS = ['COD', '21 Days', 'Advance 50%'] as const

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function addOptionalNumber(body: Record<string, unknown>, key: string, raw: string) {
  const n = parseFiniteNumber(raw)
  if (n !== undefined) body[key] = n
}

export default function BullionInquiryForm() {
  const token = getInquiryAuthToken()
  const [loading, setLoading] = useState(false)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [isCertified, setIsCertified] = useState(false)
  const [certificateCompany, setCertificateCompany] = useState('')
  const [metalType, setMetalType] = useState('Gold')
  const [metalFineness, setMetalFineness] = useState('24KT')
  const [shapeFormat, setShapeFormat] = useState('Coin')
  const [weightMin, setWeightMin] = useState('10')
  const [weightMax, setWeightMax] = useState('12')
  const [preferredMint, setPreferredMint] = useState('')
  const [quantity, setQuantity] = useState('')
  const [totalPriceMin, setTotalPriceMin] = useState('')
  const [totalPriceMax, setTotalPriceMax] = useState('')
  const [pricePerGramMin, setPricePerGramMin] = useState('')
  const [pricePerGramMax, setPricePerGramMax] = useState('')
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

  const resetForm = () => {
    setIsCertified(false)
    setCertificateCompany('')
    setMetalType('Gold')
    setMetalFineness('24KT')
    setShapeFormat('Coin')
    setWeightMin('10')
    setWeightMax('12')
    setPreferredMint('')
    setQuantity('')
    setTotalPriceMin('')
    setTotalPriceMax('')
    setPricePerGramMin('')
    setPricePerGramMax('')
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

  const fillRandomData = () => {
    setSubmitSuccessMessage('')
    setHasUnsavedChanges(true)

    const certified = Math.random() > 0.5
    const minWeight = (Math.random() * 40 + 5).toFixed(2)
    const maxWeight = (Number(minWeight) + Math.random() * 50 + 5).toFixed(2)
    const minTotal = Math.floor(Math.random() * 250000 + 100000)
    const maxTotal = minTotal + Math.floor(Math.random() * 100000 + 10000)
    const minPpg = Math.floor(Math.random() * 5000 + 12000)
    const maxPpg = minPpg + Math.floor(Math.random() * 3000 + 300)
    const urgencyDate = new Date()
    urgencyDate.setDate(urgencyDate.getDate() + Math.floor(Math.random() * 30 + 3))

    setIsCertified(certified)
    setCertificateCompany(certified ? pick(CERT_COMPANIES) : '')
    setMetalType(pick(METAL_TYPES))
    setMetalFineness(pick(METAL_FINENESS))
    setShapeFormat(pick(SHAPE_FORMATS))
    setWeightMin(minWeight)
    setWeightMax(maxWeight)
    setPreferredMint(pick(MINTS))
    setQuantity(String(Math.floor(Math.random() * 10 + 1)))
    setTotalPriceMin(String(minTotal))
    setTotalPriceMax(String(maxTotal))
    setPricePerGramMin(String(minPpg))
    setPricePerGramMax(String(maxPpg))
    setDescription('Test bullion inquiry generated from random fill button.')
    setPaymentTerms(pick(PAYMENT_TERMS))
    setLengthMin('50.56')
    setLengthMax('51.54')
    setWidthMin('50.56')
    setWidthMax('51.54')
    setHeightMin('2.56')
    setHeightMax('2.57')
    setUrgency(urgencyDate.toISOString().split('T')[0])
    setImageUrl('https://example.com/image.jpg')
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
    if (isCertified && !certificateCompany.trim()) {
      toast.error('certificateCompany is required when isCertified is true.')
      return
    }

    const weightMinN = parseFiniteNumber(weightMin)
    const weightMaxN = parseFiniteNumber(weightMax)
    if (weightMinN === undefined || weightMaxN === undefined) {
      toast.error('weightMin and weightMax must be valid numbers.')
      return
    }

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        metalType: metalType.trim(),
        metalFineness: metalFineness.trim(),
        shapeFormat: shapeFormat.trim(),
        weightMin: weightMinN,
        weightMax: weightMaxN,
      }
      if (isCertified) {
        body.isCertified = true
        body.certificateCompany = certificateCompany.trim()
      }
      if (preferredMint.trim()) body.preferredMint = preferredMint.trim()
      addOptionalNumber(body, 'quantity', quantity)
      addOptionalNumber(body, 'totalPriceMin', totalPriceMin)
      addOptionalNumber(body, 'totalPriceMax', totalPriceMax)
      addOptionalNumber(body, 'pricePerGramMin', pricePerGramMin)
      addOptionalNumber(body, 'pricePerGramMax', pricePerGramMax)
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

      const res = await inquiryService.createBullion(cleanInquiryPayload(body), token)
      if (res.success) {
        const message = res.message || 'Bullion inquiry submitted successfully.'
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
            id="bull-isCertified"
            type="checkbox"
            checked={isCertified}
            onChange={(e) => setIsCertified(e.target.checked)}
            className="rounded border-input"
          />
          <Label htmlFor="bull-isCertified" className="font-normal cursor-pointer">
            isCertified
          </Label>
        </div>
        {isCertified && (
          <div className="space-y-2">
            <Label htmlFor="bull-certificateCompany">certificateCompany</Label>
            <Input
              id="bull-certificateCompany"
              value={certificateCompany}
              onChange={(e) => setCertificateCompany(e.target.value)}
              placeholder="BIS Hallmark"
              required
            />
          </div>
        )}
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Bullion</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bull-metalType">metalType</Label>
            <Input id="bull-metalType" value={metalType} onChange={(e) => setMetalType(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-metalFineness">metalFineness</Label>
            <Input id="bull-metalFineness" value={metalFineness} onChange={(e) => setMetalFineness(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-shapeFormat">shapeFormat</Label>
            <Input id="bull-shapeFormat" value={shapeFormat} onChange={(e) => setShapeFormat(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bull-weightMin">weightMin</Label>
            <Input id="bull-weightMin" type="number" step="any" value={weightMin} onChange={(e) => setWeightMin(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-weightMax">weightMax</Label>
            <Input id="bull-weightMax" type="number" step="any" value={weightMax} onChange={(e) => setWeightMax(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bull-preferredMint">preferredMint</Label>
          <Input id="bull-preferredMint" value={preferredMint} onChange={(e) => setPreferredMint(e.target.value)} />
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Commercial</p>
        <div className="space-y-2">
          <Label htmlFor="bull-quantity">quantity</Label>
          <Input id="bull-quantity" type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bull-totalPriceMin">totalPriceMin</Label>
            <Input id="bull-totalPriceMin" type="number" step="any" value={totalPriceMin} onChange={(e) => setTotalPriceMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-totalPriceMax">totalPriceMax</Label>
            <Input id="bull-totalPriceMax" type="number" step="any" value={totalPriceMax} onChange={(e) => setTotalPriceMax(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bull-pricePerGramMin">pricePerGramMin</Label>
            <Input id="bull-pricePerGramMin" type="number" step="any" value={pricePerGramMin} onChange={(e) => setPricePerGramMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-pricePerGramMax">pricePerGramMax</Label>
            <Input id="bull-pricePerGramMax" type="number" step="any" value={pricePerGramMax} onChange={(e) => setPricePerGramMax(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bull-description">description</Label>
          <textarea
            id="bull-description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bull-paymentTerms">paymentTerms</Label>
          <Input id="bull-paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Dimensions</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bull-lengthMin">lengthMin</Label>
            <Input id="bull-lengthMin" type="number" step="any" value={lengthMin} onChange={(e) => setLengthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-lengthMax">lengthMax</Label>
            <Input id="bull-lengthMax" type="number" step="any" value={lengthMax} onChange={(e) => setLengthMax(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-widthMin">widthMin</Label>
            <Input id="bull-widthMin" type="number" step="any" value={widthMin} onChange={(e) => setWidthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-widthMax">widthMax</Label>
            <Input id="bull-widthMax" type="number" step="any" value={widthMax} onChange={(e) => setWidthMax(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-heightMin">heightMin</Label>
            <Input id="bull-heightMin" type="number" step="any" value={heightMin} onChange={(e) => setHeightMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-heightMax">heightMax</Label>
            <Input id="bull-heightMax" type="number" step="any" value={heightMax} onChange={(e) => setHeightMax(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Logistics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bull-urgency">urgency</Label>
            <Input id="bull-urgency" type="date" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bull-imageUrl">imageUrl</Label>
            <Input id="bull-imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bull-deliveryLocation">deliveryLocation</Label>
          <Input id="bull-deliveryLocation" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
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
            {loading ? 'Submitting your inquiry…' : 'Submit bullion inquiry'}
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Submit is enabled after you make changes.
        </p>
      </div>
    </form>
  )
}
