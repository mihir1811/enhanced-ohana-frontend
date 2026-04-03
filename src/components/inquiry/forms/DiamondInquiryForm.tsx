'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inquiryService } from '@/services/inquiryService'
import { cleanInquiryPayload, getInquiryAuthToken, parseFiniteNumber } from '../inquiryFormUtils'

const SubCategory = { PARCEL: 'PARCEL', SINGLE: 'SINGLE' } as const
const DiamondType = { LAB: 'LAB', NATURAL: 'NATURAL' } as const
const GrowthProcess = { CVD: 'CVD', HPHT: 'HPHT' } as const
const SHAPES = ['Round', 'Oval', 'Princess', 'Cushion', 'Pear'] as const
const COLORS = ['D', 'E', 'F', 'G', 'H'] as const
const CLARITIES = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2'] as const
const CERT_COMPANIES = ['GIA', 'IGI', 'HRD'] as const
const INCLUSION_TYPES = ['White', 'Black', 'Crystal', 'Needle'] as const
const FLUORESCENCE_VALUES = ['None', 'Faint', 'Medium', 'Strong'] as const

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Add optional numeric DTO field only when value is a finite number (never string). */
function addOptionalNumber(body: Record<string, unknown>, key: string, raw: string) {
  const n = parseFiniteNumber(raw)
  if (n !== undefined) body[key] = n
}

export default function DiamondInquiryForm() {
  const token = getInquiryAuthToken()
  const [loading, setLoading] = useState(false)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [subCategory, setSubCategory] = useState<string>(SubCategory.SINGLE)
  const [diamondType, setDiamondType] = useState<string>(DiamondType.NATURAL)
  const [growthProcess, setGrowthProcess] = useState<string>(GrowthProcess.CVD)
  const [isCertified, setIsCertified] = useState(false)
  const [certificateCompany, setCertificateCompany] = useState('')
  const [sieveSizeMin, setSieveSizeMin] = useState('')
  const [sieveSizeMax, setSieveSizeMax] = useState('')
  const [shape, setShape] = useState('Round')
  const [caratMin, setCaratMin] = useState('1')
  const [caratMax, setCaratMax] = useState('2')
  const [colorMin, setColorMin] = useState('D')
  const [colorMax, setColorMax] = useState('G')
  const [clarityMin, setClarityMin] = useState('VVS2')
  const [clarityMax, setClarityMax] = useState('VS2')
  const [cut, setCut] = useState('')
  const [bgm, setBgm] = useState(false)
  const [inclusionType, setInclusionType] = useState('')
  const [fluorescenceIntensityMin, setFluorescenceIntensityMin] = useState('')
  const [fluorescenceIntensityMax, setFluorescenceIntensityMax] = useState('')
  const [quantity, setQuantity] = useState('')
  const [totalPriceMin, setTotalPriceMin] = useState('')
  const [totalPriceMax, setTotalPriceMax] = useState('')
  const [pricePerCaratMin, setPricePerCaratMin] = useState('')
  const [pricePerCaratMax, setPricePerCaratMax] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [remarks, setRemarks] = useState('')
  const [lengthMin, setLengthMin] = useState('')
  const [lengthMax, setLengthMax] = useState('')
  const [widthMin, setWidthMin] = useState('')
  const [widthMax, setWidthMax] = useState('')
  const [heightMin, setHeightMin] = useState('')
  const [heightMax, setHeightMax] = useState('')
  const [urgency, setUrgency] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')

  const clearDimensionFields = () => {
    setLengthMin('')
    setLengthMax('')
    setWidthMin('')
    setWidthMax('')
    setHeightMin('')
    setHeightMax('')
  }

  const resetForm = () => {
    setSubCategory(SubCategory.SINGLE)
    setDiamondType(DiamondType.NATURAL)
    setGrowthProcess(GrowthProcess.CVD)
    setIsCertified(false)
    setCertificateCompany('')
    setSieveSizeMin('')
    setSieveSizeMax('')
    setShape('Round')
    setCaratMin('1')
    setCaratMax('2')
    setColorMin('D')
    setColorMax('G')
    setClarityMin('VVS2')
    setClarityMax('VS2')
    setCut('')
    setBgm(false)
    setInclusionType('')
    setFluorescenceIntensityMin('')
    setFluorescenceIntensityMax('')
    setQuantity('')
    setTotalPriceMin('')
    setTotalPriceMax('')
    setPricePerCaratMin('')
    setPricePerCaratMax('')
    setPaymentTerms('')
    setRemarks('')
    clearDimensionFields()
    setUrgency('')
    setImageUrl('')
    setDeliveryLocation('')
    setHasUnsavedChanges(false)
  }

  const fillRandomData = () => {
    setSubmitSuccessMessage('')
    setHasUnsavedChanges(true)
    const randomSubCategory = Math.random() > 0.5 ? SubCategory.SINGLE : SubCategory.PARCEL
    const randomDiamondType = Math.random() > 0.5 ? DiamondType.LAB : DiamondType.NATURAL
    const randomCertified = Math.random() > 0.5
    const minCarat = (Math.random() * 2 + 0.3).toFixed(2)
    const maxCarat = (Number(minCarat) + Math.random() * 2 + 0.2).toFixed(2)
    const minPricePerCarat = Math.floor(Math.random() * 2000 + 2000)
    const maxPricePerCarat = minPricePerCarat + Math.floor(Math.random() * 2500 + 500)
    const totalMin = Math.floor(Math.random() * 20000 + 10000)
    const totalMax = totalMin + Math.floor(Math.random() * 30000 + 5000)
    const urgencyDate = new Date()
    urgencyDate.setDate(urgencyDate.getDate() + Math.floor(Math.random() * 30 + 3))

    setSubCategory(randomSubCategory)
    setDiamondType(randomDiamondType)
    setGrowthProcess(pick([GrowthProcess.CVD, GrowthProcess.HPHT] as const))
    setIsCertified(randomCertified)
    setCertificateCompany(randomCertified ? pick(CERT_COMPANIES) : '')
    setSieveSizeMin(randomSubCategory === SubCategory.PARCEL ? '+4.5' : '')
    setSieveSizeMax(randomSubCategory === SubCategory.PARCEL ? '-8.5' : '')
    setShape(pick(SHAPES))
    setCaratMin(minCarat)
    setCaratMax(maxCarat)
    setColorMin(pick(COLORS))
    setColorMax(pick(COLORS))
    setClarityMin(pick(CLARITIES))
    setClarityMax(pick(CLARITIES))
    setCut('EX-VG-VG')
    setBgm(Math.random() > 0.6)
    setInclusionType(pick(INCLUSION_TYPES))
    setFluorescenceIntensityMin(pick(FLUORESCENCE_VALUES))
    setFluorescenceIntensityMax(pick(FLUORESCENCE_VALUES))
    setQuantity(String(Math.floor(Math.random() * 25 + 1)))
    setTotalPriceMin(String(totalMin))
    setTotalPriceMax(String(totalMax))
    setPricePerCaratMin(String(minPricePerCarat))
    setPricePerCaratMax(String(maxPricePerCarat))
    setPaymentTerms('21 Days')
    setRemarks('Test inquiry (random fill).')
    if (randomSubCategory === SubCategory.SINGLE) {
      setLengthMin('4.5')
      setLengthMax('5.5')
      setWidthMin('3.2')
      setWidthMax('3.8')
      setHeightMin('2.1')
      setHeightMax('2.5')
    } else {
      clearDimensionFields()
    }
    setUrgency(urgencyDate.toISOString().split('T')[0])
    setDeliveryLocation('Surat')
    setImageUrl('https://example.com/image.jpg')

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
      toast.error('Certificate company is required when certified.')
      return
    }

    const caratMinN = parseFiniteNumber(caratMin)
    const caratMaxN = parseFiniteNumber(caratMax)
    if (caratMinN === undefined || caratMaxN === undefined) {
      toast.error('Carat min and max must be valid numbers.')
      return
    }

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        subCategory,
        diamondType,
        shape: shape.trim(),
        caratMin: caratMinN,
        caratMax: caratMaxN,
        colorMin: colorMin.trim(),
        colorMax: colorMax.trim(),
        clarityMin: clarityMin.trim(),
        clarityMax: clarityMax.trim(),
      }

      if (diamondType === DiamondType.LAB) {
        body.growthProcess = growthProcess
      }
      if (isCertified) {
        body.isCertified = true
        body.certificateCompany = certificateCompany.trim()
      }
      if (subCategory === SubCategory.PARCEL) {
        if (sieveSizeMin.trim()) body.sieveSizeMin = sieveSizeMin.trim()
        if (sieveSizeMax.trim()) body.sieveSizeMax = sieveSizeMax.trim()
      }
      if (cut.trim()) body.cut = cut.trim()
      if (bgm) body.bgm = true
      if (inclusionType.trim()) body.inclusionType = inclusionType.trim()
      if (fluorescenceIntensityMin.trim()) body.fluorescenceIntensityMin = fluorescenceIntensityMin.trim()
      if (fluorescenceIntensityMax.trim()) body.fluorescenceIntensityMax = fluorescenceIntensityMax.trim()
      addOptionalNumber(body, 'quantity', quantity)
      addOptionalNumber(body, 'totalPriceMin', totalPriceMin)
      addOptionalNumber(body, 'totalPriceMax', totalPriceMax)
      addOptionalNumber(body, 'pricePerCaratMin', pricePerCaratMin)
      addOptionalNumber(body, 'pricePerCaratMax', pricePerCaratMax)
      if (paymentTerms.trim()) body.paymentTerms = paymentTerms.trim()
      if (remarks.trim()) body.remarks = remarks.trim()

      if (subCategory === SubCategory.SINGLE) {
        addOptionalNumber(body, 'lengthMin', lengthMin)
        addOptionalNumber(body, 'lengthMax', lengthMax)
        addOptionalNumber(body, 'widthMin', widthMin)
        addOptionalNumber(body, 'widthMax', widthMax)
        addOptionalNumber(body, 'heightMin', heightMin)
        addOptionalNumber(body, 'heightMax', heightMax)
      }

      if (urgency) body.urgency = new Date(urgency).toISOString()
      if (imageUrl.trim()) body.imageUrl = imageUrl.trim()
      if (deliveryLocation.trim()) body.deliveryLocation = deliveryLocation.trim()

      const res = await inquiryService.createDiamond(cleanInquiryPayload(body), token)
      if (res.success) {
        const message = res.message || 'Diamond inquiry submitted successfully.'
        toast.success(message)
        setSubmitSuccessMessage(message)
        resetForm()
      } else {
        toast.error(res.message || 'Request failed.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit inquiry'
      toast.error(msg)
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
        <p className="text-sm font-medium">Basic Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-subCategory">subCategory</Label>
          <select
            id="diamond-subCategory"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={subCategory}
            onChange={(e) => {
              const v = e.target.value
              setSubCategory(v)
              if (v === SubCategory.PARCEL) clearDimensionFields()
            }}
          >
            <option value={SubCategory.SINGLE}>SINGLE</option>
            <option value={SubCategory.PARCEL}>PARCEL</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-diamondType">diamondType</Label>
          <select
            id="diamond-diamondType"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={diamondType}
            onChange={(e) => setDiamondType(e.target.value)}
          >
            <option value={DiamondType.NATURAL}>NATURAL</option>
            <option value={DiamondType.LAB}>LAB</option>
          </select>
        </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Quality & Specs</p>
      {diamondType === DiamondType.LAB && (
        <div className="space-y-2">
          <Label htmlFor="diamond-growthProcess">growthProcess</Label>
          <select
            id="diamond-growthProcess"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={growthProcess}
            onChange={(e) => setGrowthProcess(e.target.value)}
          >
            <option value={GrowthProcess.CVD}>CVD</option>
            <option value={GrowthProcess.HPHT}>HPHT</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          id="diamond-isCertified"
          type="checkbox"
          checked={isCertified}
          onChange={(e) => setIsCertified(e.target.checked)}
          className="rounded border-input"
        />
        <Label htmlFor="diamond-isCertified" className="font-normal cursor-pointer">
          isCertified
        </Label>
      </div>
      {isCertified && (
        <div className="space-y-2">
          <Label htmlFor="diamond-certificateCompany">certificateCompany</Label>
          <Input
            id="diamond-certificateCompany"
            value={certificateCompany}
            onChange={(e) => setCertificateCompany(e.target.value)}
            placeholder="GIA"
            required
          />
        </div>
      )}

      {subCategory === SubCategory.PARCEL && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diamond-sieveSizeMin">sieveSizeMin</Label>
            <Input id="diamond-sieveSizeMin" value={sieveSizeMin} onChange={(e) => setSieveSizeMin(e.target.value)} placeholder="+4.5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamond-sieveSizeMax">sieveSizeMax</Label>
            <Input id="diamond-sieveSizeMax" value={sieveSizeMax} onChange={(e) => setSieveSizeMax(e.target.value)} placeholder="-8.5" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="diamond-shape">shape</Label>
        <Input id="diamond-shape" value={shape} onChange={(e) => setShape(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-caratMin">caratMin</Label>
          <Input id="diamond-caratMin" type="number" step="any" value={caratMin} onChange={(e) => setCaratMin(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-caratMax">caratMax</Label>
          <Input id="diamond-caratMax" type="number" step="any" value={caratMax} onChange={(e) => setCaratMax(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-colorMin">colorMin</Label>
          <Input id="diamond-colorMin" value={colorMin} onChange={(e) => setColorMin(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-colorMax">colorMax</Label>
          <Input id="diamond-colorMax" value={colorMax} onChange={(e) => setColorMax(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-clarityMin">clarityMin</Label>
          <Input id="diamond-clarityMin" value={clarityMin} onChange={(e) => setClarityMin(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-clarityMax">clarityMax</Label>
          <Input id="diamond-clarityMax" value={clarityMax} onChange={(e) => setClarityMax(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diamond-cut">cut</Label>
        <Input id="diamond-cut" value={cut} onChange={(e) => setCut(e.target.value)} placeholder="EX-VG-VG" />
      </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Commercial</p>
      <div className="flex items-center gap-2">
        <input id="diamond-bgm" type="checkbox" checked={bgm} onChange={(e) => setBgm(e.target.checked)} className="rounded border-input" />
        <Label htmlFor="diamond-bgm" className="font-normal cursor-pointer">
          bgm
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diamond-inclusionType">inclusionType</Label>
        <Input id="diamond-inclusionType" value={inclusionType} onChange={(e) => setInclusionType(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-fluorescenceIntensityMin">fluorescenceIntensityMin</Label>
          <Input id="diamond-fluorescenceIntensityMin" value={fluorescenceIntensityMin} onChange={(e) => setFluorescenceIntensityMin(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-fluorescenceIntensityMax">fluorescenceIntensityMax</Label>
          <Input id="diamond-fluorescenceIntensityMax" value={fluorescenceIntensityMax} onChange={(e) => setFluorescenceIntensityMax(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diamond-quantity">quantity</Label>
        <Input id="diamond-quantity" type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-totalPriceMin">totalPriceMin</Label>
          <Input id="diamond-totalPriceMin" type="number" step="any" value={totalPriceMin} onChange={(e) => setTotalPriceMin(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-totalPriceMax">totalPriceMax</Label>
          <Input id="diamond-totalPriceMax" type="number" step="any" value={totalPriceMax} onChange={(e) => setTotalPriceMax(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-pricePerCaratMin">pricePerCaratMin</Label>
          <Input id="diamond-pricePerCaratMin" type="number" step="any" value={pricePerCaratMin} onChange={(e) => setPricePerCaratMin(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-pricePerCaratMax">pricePerCaratMax</Label>
          <Input id="diamond-pricePerCaratMax" type="number" step="any" value={pricePerCaratMax} onChange={(e) => setPricePerCaratMax(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diamond-paymentTerms">paymentTerms</Label>
        <Input id="diamond-paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diamond-remarks">remarks</Label>
        <textarea
          id="diamond-remarks"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>
      </section>

      {subCategory === SubCategory.SINGLE && (
        <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm font-medium">Dimensions (SINGLE)</p>
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diamond-lengthMin">lengthMin</Label>
            <Input id="diamond-lengthMin" type="number" step="any" value={lengthMin} onChange={(e) => setLengthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamond-lengthMax">lengthMax</Label>
            <Input id="diamond-lengthMax" type="number" step="any" value={lengthMax} onChange={(e) => setLengthMax(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamond-widthMin">widthMin</Label>
            <Input id="diamond-widthMin" type="number" step="any" value={widthMin} onChange={(e) => setWidthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamond-widthMax">widthMax</Label>
            <Input id="diamond-widthMax" type="number" step="any" value={widthMax} onChange={(e) => setWidthMax(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamond-heightMin">heightMin</Label>
            <Input id="diamond-heightMin" type="number" step="any" value={heightMin} onChange={(e) => setHeightMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diamond-heightMax">heightMax</Label>
            <Input id="diamond-heightMax" type="number" step="any" value={heightMax} onChange={(e) => setHeightMax(e.target.value)} />
          </div>
          </div>
        </section>
      )}

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Logistics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diamond-urgency">urgency</Label>
          <Input id="diamond-urgency" type="date" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diamond-imageUrl">imageUrl</Label>
          <Input id="diamond-imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diamond-deliveryLocation">deliveryLocation</Label>
        <Input id="diamond-deliveryLocation" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
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
            {loading ? 'Submitting your inquiry…' : 'Submit diamond inquiry'}
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Submit is enabled after you make changes.
        </p>
      </div>
    </form>
  )
}
