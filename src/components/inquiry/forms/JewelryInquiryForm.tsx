'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inquiryService } from '@/services/inquiryService'
import { cleanInquiryPayload, getInquiryAuthToken, parseFiniteNumber } from '../inquiryFormUtils'

const DiamondStoneType = { NATURAL: 'NATURAL', LAB: 'LAB' } as const
const SUB_CATEGORIES = ['Ring', 'Necklace', 'Bracelet', 'Earrings', 'Pendant'] as const
const METAL_TYPES = ['Gold', 'Silver', 'Platinum'] as const
const METAL_PURITY = ['18KT', '22KT', '14KT', '925'] as const
const METAL_COLORS = ['Yellow', 'White', 'Rose'] as const
const WEARERS = ['Female', 'Male', 'Unisex'] as const
const OCCASIONS = ['Wedding', 'Engagement', 'Anniversary', 'Daily Wear'] as const
const STONE_SHAPES = ['Round', 'Oval', 'Cushion', 'Pear', 'Princess'] as const
const PAYMENT_TERMS = ['COD', '21 Days', 'Advance 50%'] as const

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function addOptionalNumber(body: Record<string, unknown>, key: string, raw: string) {
  const n = parseFiniteNumber(raw)
  if (n !== undefined) body[key] = n
}

export default function JewelryInquiryForm() {
  const token = getInquiryAuthToken()
  const [loading, setLoading] = useState(false)
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [subCategory, setSubCategory] = useState('Ring')
  const [occasion, setOccasion] = useState('')
  const [intendedWearer, setIntendedWearer] = useState('')
  const [metalType, setMetalType] = useState('Gold')
  const [metalColor, setMetalColor] = useState('')
  const [metalPurity, setMetalPurity] = useState('18KT')
  const [finish, setFinish] = useState('')
  const [hasStone, setHasStone] = useState(false)
  const [stoneType, setStoneType] = useState<string>(DiamondStoneType.NATURAL)
  const [stoneShape, setStoneShape] = useState('')
  const [stoneCaratMin, setStoneCaratMin] = useState('')
  const [stoneCaratMax, setStoneCaratMax] = useState('')
  const [stoneColorMin, setStoneColorMin] = useState('')
  const [stoneColorMax, setStoneColorMax] = useState('')
  const [stoneClarityMin, setStoneClarityMin] = useState('')
  const [stoneClarityMax, setStoneClarityMax] = useState('')
  const [stoneCut, setStoneCut] = useState('')
  const [stoneQuantity, setStoneQuantity] = useState('')
  const [settingType, setSettingType] = useState('')
  const [ringSize, setRingSize] = useState('')
  const [chainLengthMin, setChainLengthMin] = useState('')
  const [chainLengthMax, setChainLengthMax] = useState('')
  const [widthMin, setWidthMin] = useState('')
  const [widthMax, setWidthMax] = useState('')
  const [thicknessMin, setThicknessMin] = useState('')
  const [thicknessMax, setThicknessMax] = useState('')
  const [approxWeightMin, setApproxWeightMin] = useState('')
  const [approxWeightMax, setApproxWeightMax] = useState('')
  const [isEngravingRequired, setIsEngravingRequired] = useState(false)
  const [engravingText, setEngravingText] = useState('')
  const [quantity, setQuantity] = useState('')
  const [totalPriceMin, setTotalPriceMin] = useState('')
  const [totalPriceMax, setTotalPriceMax] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [designDescription, setDesignDescription] = useState('')
  const [referenceImage, setReferenceImage] = useState('')
  const [referenceVideo, setReferenceVideo] = useState('')
  const [urgency, setUrgency] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')

  const clearStoneFields = () => {
    setStoneType(DiamondStoneType.NATURAL)
    setStoneShape('')
    setStoneCaratMin('')
    setStoneCaratMax('')
    setStoneColorMin('')
    setStoneColorMax('')
    setStoneClarityMin('')
    setStoneClarityMax('')
    setStoneCut('')
    setStoneQuantity('')
  }

  const resetForm = () => {
    setSubCategory('Ring')
    setOccasion('')
    setIntendedWearer('')
    setMetalType('Gold')
    setMetalColor('')
    setMetalPurity('18KT')
    setFinish('')
    setHasStone(false)
    clearStoneFields()
    setSettingType('')
    setRingSize('')
    setChainLengthMin('')
    setChainLengthMax('')
    setWidthMin('')
    setWidthMax('')
    setThicknessMin('')
    setThicknessMax('')
    setApproxWeightMin('')
    setApproxWeightMax('')
    setIsEngravingRequired(false)
    setEngravingText('')
    setQuantity('')
    setTotalPriceMin('')
    setTotalPriceMax('')
    setPaymentTerms('')
    setDesignDescription('')
    setReferenceImage('')
    setReferenceVideo('')
    setUrgency('')
    setDeliveryLocation('')
    setHasUnsavedChanges(false)
  }

  const fillRandomData = () => {
    setSubmitSuccessMessage('')
    setHasUnsavedChanges(true)
    const randomHasStone = Math.random() > 0.4
    const randomEngraving = Math.random() > 0.6
    const urgencyDate = new Date()
    urgencyDate.setDate(urgencyDate.getDate() + Math.floor(Math.random() * 30 + 3))
    const totalMin = Math.floor(Math.random() * 70000 + 30000)
    const totalMax = totalMin + Math.floor(Math.random() * 60000 + 10000)

    setSubCategory(pick(SUB_CATEGORIES))
    setOccasion(pick(OCCASIONS))
    setIntendedWearer(pick(WEARERS))
    setMetalType(pick(METAL_TYPES))
    setMetalColor(pick(METAL_COLORS))
    setMetalPurity(pick(METAL_PURITY))
    setFinish('Glossy')
    setHasStone(randomHasStone)
    if (randomHasStone) {
      setStoneType(Math.random() > 0.5 ? DiamondStoneType.NATURAL : DiamondStoneType.LAB)
      setStoneShape(pick(STONE_SHAPES))
      setStoneCaratMin('1.5')
      setStoneCaratMax('2.5')
      setStoneColorMin('D')
      setStoneColorMax('G')
      setStoneClarityMin('VVS1')
      setStoneClarityMax('VS2')
      setStoneCut('EX')
      setStoneQuantity('1')
    } else {
      clearStoneFields()
    }
    setSettingType('Prong')
    setRingSize('US 7')
    setChainLengthMin('16')
    setChainLengthMax('18')
    setWidthMin('5')
    setWidthMax('6')
    setThicknessMin('2')
    setThicknessMax('3')
    setApproxWeightMin('10')
    setApproxWeightMax('15')
    setIsEngravingRequired(randomEngraving)
    setEngravingText(randomEngraving ? 'Happy Anniversary' : '')
    setQuantity(String(Math.floor(Math.random() * 4 + 1)))
    setTotalPriceMin(String(totalMin))
    setTotalPriceMax(String(totalMax))
    setPaymentTerms(pick(PAYMENT_TERMS))
    setDesignDescription('Custom jewellery design for testing.')
    setReferenceImage('https://example.com/image.jpg')
    setReferenceVideo('https://example.com/video.mp4')
    setUrgency(urgencyDate.toISOString().split('T')[0])
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
    if (isEngravingRequired && !engravingText.trim()) {
      toast.error('engravingText is required when isEngravingRequired is true.')
      return
    }

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        subCategory: subCategory.trim(),
        metalType: metalType.trim(),
        metalPurity: metalPurity.trim(),
        hasStone,
      }
      if (occasion.trim()) body.occasion = occasion.trim()
      if (intendedWearer.trim()) body.intendedWearer = intendedWearer.trim()
      if (metalColor.trim()) body.metalColor = metalColor.trim()
      if (finish.trim()) body.finish = finish.trim()

      if (hasStone) {
        body.stoneType = stoneType
        if (stoneShape.trim()) body.stoneShape = stoneShape.trim()
        addOptionalNumber(body, 'stoneCaratMin', stoneCaratMin)
        addOptionalNumber(body, 'stoneCaratMax', stoneCaratMax)
        if (stoneColorMin.trim()) body.stoneColorMin = stoneColorMin.trim()
        if (stoneColorMax.trim()) body.stoneColorMax = stoneColorMax.trim()
        if (stoneClarityMin.trim()) body.stoneClarityMin = stoneClarityMin.trim()
        if (stoneClarityMax.trim()) body.stoneClarityMax = stoneClarityMax.trim()
        if (stoneCut.trim()) body.stoneCut = stoneCut.trim()
        addOptionalNumber(body, 'stoneQuantity', stoneQuantity)
      }

      if (settingType.trim()) body.settingType = settingType.trim()
      if (ringSize.trim()) body.ringSize = ringSize.trim()
      addOptionalNumber(body, 'chainLengthMin', chainLengthMin)
      addOptionalNumber(body, 'chainLengthMax', chainLengthMax)
      addOptionalNumber(body, 'widthMin', widthMin)
      addOptionalNumber(body, 'widthMax', widthMax)
      addOptionalNumber(body, 'thicknessMin', thicknessMin)
      addOptionalNumber(body, 'thicknessMax', thicknessMax)
      addOptionalNumber(body, 'approxWeightMin', approxWeightMin)
      addOptionalNumber(body, 'approxWeightMax', approxWeightMax)

      if (isEngravingRequired) {
        body.isEngravingRequired = true
        body.engravingText = engravingText.trim()
      }
      addOptionalNumber(body, 'quantity', quantity)
      addOptionalNumber(body, 'totalPriceMin', totalPriceMin)
      addOptionalNumber(body, 'totalPriceMax', totalPriceMax)
      if (paymentTerms.trim()) body.paymentTerms = paymentTerms.trim()
      if (designDescription.trim()) body.designDescription = designDescription.trim()
      if (referenceImage.trim()) body.referenceImage = referenceImage.trim()
      if (referenceVideo.trim()) body.referenceVideo = referenceVideo.trim()
      if (urgency) body.urgency = new Date(urgency).toISOString()
      if (deliveryLocation.trim()) body.deliveryLocation = deliveryLocation.trim()

      const res = await inquiryService.createJewellery(cleanInquiryPayload(body), token)
      if (res.success) {
        const message = res.message || 'Jewellery inquiry submitted successfully.'
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
        <p className="text-sm font-medium">Base Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-subCategory">subCategory</Label>
            <Input id="j-subCategory" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-metalType">metalType</Label>
            <Input id="j-metalType" value={metalType} onChange={(e) => setMetalType(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-metalPurity">metalPurity</Label>
            <Input id="j-metalPurity" value={metalPurity} onChange={(e) => setMetalPurity(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-metalColor">metalColor</Label>
            <Input id="j-metalColor" value={metalColor} onChange={(e) => setMetalColor(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-occasion">occasion</Label>
            <Input id="j-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-intendedWearer">intendedWearer</Label>
            <Input id="j-intendedWearer" value={intendedWearer} onChange={(e) => setIntendedWearer(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="j-finish">finish</Label>
          <Input id="j-finish" value={finish} onChange={(e) => setFinish(e.target.value)} />
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Stone Details</p>
        <div className="flex items-center gap-2">
          <input
            id="j-hasStone"
            type="checkbox"
            checked={hasStone}
            onChange={(e) => {
              const checked = e.target.checked
              setHasStone(checked)
              if (!checked) clearStoneFields()
            }}
            className="rounded border-input"
          />
          <Label htmlFor="j-hasStone" className="font-normal cursor-pointer">
            hasStone
          </Label>
        </div>

        {hasStone && (
          <>
            <div className="space-y-2">
              <Label htmlFor="j-stoneType">stoneType</Label>
              <select
                id="j-stoneType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={stoneType}
                onChange={(e) => setStoneType(e.target.value)}
              >
                <option value={DiamondStoneType.NATURAL}>NATURAL</option>
                <option value={DiamondStoneType.LAB}>LAB</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-stoneShape">stoneShape</Label>
              <Input id="j-stoneShape" value={stoneShape} onChange={(e) => setStoneShape(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="j-stoneCaratMin">stoneCaratMin</Label>
                <Input id="j-stoneCaratMin" type="number" step="any" value={stoneCaratMin} onChange={(e) => setStoneCaratMin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="j-stoneCaratMax">stoneCaratMax</Label>
                <Input id="j-stoneCaratMax" type="number" step="any" value={stoneCaratMax} onChange={(e) => setStoneCaratMax(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="j-stoneColorMin">stoneColorMin</Label>
                <Input id="j-stoneColorMin" value={stoneColorMin} onChange={(e) => setStoneColorMin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="j-stoneColorMax">stoneColorMax</Label>
                <Input id="j-stoneColorMax" value={stoneColorMax} onChange={(e) => setStoneColorMax(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="j-stoneClarityMin">stoneClarityMin</Label>
                <Input id="j-stoneClarityMin" value={stoneClarityMin} onChange={(e) => setStoneClarityMin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="j-stoneClarityMax">stoneClarityMax</Label>
                <Input id="j-stoneClarityMax" value={stoneClarityMax} onChange={(e) => setStoneClarityMax(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-stoneCut">stoneCut</Label>
              <Input id="j-stoneCut" value={stoneCut} onChange={(e) => setStoneCut(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-stoneQuantity">stoneQuantity</Label>
              <Input id="j-stoneQuantity" type="number" step="any" value={stoneQuantity} onChange={(e) => setStoneQuantity(e.target.value)} />
            </div>
          </>
        )}
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Design & Dimensions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-settingType">settingType</Label>
            <Input id="j-settingType" value={settingType} onChange={(e) => setSettingType(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-ringSize">ringSize</Label>
            <Input id="j-ringSize" value={ringSize} onChange={(e) => setRingSize(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-chainLengthMin">chainLengthMin</Label>
            <Input id="j-chainLengthMin" type="number" step="any" value={chainLengthMin} onChange={(e) => setChainLengthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-chainLengthMax">chainLengthMax</Label>
            <Input id="j-chainLengthMax" type="number" step="any" value={chainLengthMax} onChange={(e) => setChainLengthMax(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-widthMin">widthMin</Label>
            <Input id="j-widthMin" type="number" step="any" value={widthMin} onChange={(e) => setWidthMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-widthMax">widthMax</Label>
            <Input id="j-widthMax" type="number" step="any" value={widthMax} onChange={(e) => setWidthMax(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-thicknessMin">thicknessMin</Label>
            <Input id="j-thicknessMin" type="number" step="any" value={thicknessMin} onChange={(e) => setThicknessMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-thicknessMax">thicknessMax</Label>
            <Input id="j-thicknessMax" type="number" step="any" value={thicknessMax} onChange={(e) => setThicknessMax(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-approxWeightMin">approxWeightMin</Label>
            <Input id="j-approxWeightMin" type="number" step="any" value={approxWeightMin} onChange={(e) => setApproxWeightMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-approxWeightMax">approxWeightMax</Label>
            <Input id="j-approxWeightMax" type="number" step="any" value={approxWeightMax} onChange={(e) => setApproxWeightMax(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">Commercial & Delivery</p>
        <div className="flex items-center gap-2">
          <input
            id="j-isEngravingRequired"
            type="checkbox"
            checked={isEngravingRequired}
            onChange={(e) => setIsEngravingRequired(e.target.checked)}
            className="rounded border-input"
          />
          <Label htmlFor="j-isEngravingRequired" className="font-normal cursor-pointer">
            isEngravingRequired
          </Label>
        </div>
        {isEngravingRequired && (
          <div className="space-y-2">
            <Label htmlFor="j-engravingText">engravingText</Label>
            <Input id="j-engravingText" value={engravingText} onChange={(e) => setEngravingText(e.target.value)} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-quantity">quantity</Label>
            <Input id="j-quantity" type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-paymentTerms">paymentTerms</Label>
            <Input id="j-paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-totalPriceMin">totalPriceMin</Label>
            <Input id="j-totalPriceMin" type="number" step="any" value={totalPriceMin} onChange={(e) => setTotalPriceMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-totalPriceMax">totalPriceMax</Label>
            <Input id="j-totalPriceMax" type="number" step="any" value={totalPriceMax} onChange={(e) => setTotalPriceMax(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="j-designDescription">designDescription</Label>
          <textarea
            id="j-designDescription"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={designDescription}
            onChange={(e) => setDesignDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-referenceImage">referenceImage</Label>
            <Input id="j-referenceImage" value={referenceImage} onChange={(e) => setReferenceImage(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-referenceVideo">referenceVideo</Label>
            <Input id="j-referenceVideo" value={referenceVideo} onChange={(e) => setReferenceVideo(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="j-urgency">urgency</Label>
            <Input id="j-urgency" type="date" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="j-deliveryLocation">deliveryLocation</Label>
            <Input id="j-deliveryLocation" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
          </div>
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
            {loading ? 'Submitting your inquiry…' : 'Submit jewelry inquiry'}
          </Button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Submit is enabled after you make changes.
        </p>
      </div>
    </form>
  )
}
