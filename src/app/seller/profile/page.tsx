'use client'


import { useEffect, useState } from 'react'
import { useLoading } from '@/hooks/useLoading'
import { PageLoader } from '@/components/seller/Loader'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateSellerInfo } from '@/features/seller/sellerSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function SellerProfilePage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const isLoading = isPageLoading('profile')
  const dispatch = useAppDispatch()
  const seller = useSelector((state: RootState) => state.seller.profile)
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const isSeller = user?.role === 'seller'
  const loading = useAppSelector((state) => state.seller.isLoading)


  // Local state for form fields
  const [form, setForm] = useState({
    companyName: seller?.companyName || '',
    addressLine1: seller?.addressLine1 || '',
    addressLine2: seller?.addressLine2 || '',
    city: seller?.city || '',
    state: seller?.state || '',
    country: seller?.country || '',
    zipCode: seller?.zipCode || '',
  })
  const [companyLogo, setCompanyLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(seller?.companyLogo || null)
  const [panCard, setPanCard] = useState<File | null>(null)
  const [gstNumber, setGstNumber] = useState<File | null>(null)

  useEffect(() => {
    if (seller) {
      setForm({
        companyName: seller.companyName || '',
        addressLine1: seller.addressLine1 || '',
        addressLine2: seller.addressLine2 || '',
        city: seller.city || '',
        state: seller.state || '',
        country: seller.country || '',
        zipCode: seller.zipCode || '',
      })
      setLogoPreview(seller.companyLogo || null)
      setCompanyLogo(null)
    }
  }, [seller])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (setter: (file: File | null) => void, previewSetter?: (url: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      if (previewSetter) {
        const url = URL.createObjectURL(file);
        previewSetter(url);
      }
    } else {
      setter(null);
      if (previewSetter) previewSetter(seller?.companyLogo || null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    await dispatch(updateSellerInfo({
      data: {
        companyName: form.companyName,
        companyLogo,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        country: form.country,
        zipCode: form.zipCode,
        panCard,
        gstNumber,
      },
      token,
    }))
  }

  useEffect(() => {
    // setPageLoading('profile', true)
    
    // Simulate loading profile data
    const timer = setTimeout(() => {
      setPageLoading('profile', false)
    }, 1600)

    return () => clearTimeout(timer)
  }, []) // Empty dependency array - only run once on mount


  if (isLoading || !isSeller) {
    return <PageLoader />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Profile
          </h1>
          <p className="mt-2 text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Manage your seller profile and account settings.
          </p>
        </div>
      </div>

  <form onSubmit={handleSubmit} className="rounded-xl border p-8 w-full mx-auto bg-card" style={{ borderColor: 'var(--border)' }} encType="multipart/form-data">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--card-foreground)' }}>
          Seller Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Company Logo</label>
            {logoPreview && (
              <div className="mb-2">
                <img
                  src={logoPreview}
                  alt="Company Logo Preview"
                  className="h-20 w-20 object-contain border rounded"
                  style={{ background: '#fff' }}
                />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange(setCompanyLogo, setLogoPreview)} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Address Line 1</label>
            <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Address Line 2</label>
            <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">State</label>
            <input name="state" value={form.state} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Zip Code</label>
            <input name="zipCode" value={form.zipCode} onChange={handleChange} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">PAN Card</label>
            <input type="file" accept="application/pdf,image/*" onChange={handleFileChange(setPanCard)} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">GST Number (File)</label>
            <input type="file" accept="application/pdf,image/*" onChange={handleFileChange(setGstNumber)} className="input input-bordered input-bordered-custom w-full rounded py-1 px-2" />
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-8 justify-end">
          <button type="button" className="px-4 py-2 rounded-lg font-medium transition-colors border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'transparent' }} disabled={loading} onClick={() => seller && setForm({
            companyName: seller.companyName || '',
            addressLine1: seller.addressLine1 || '',
            addressLine2: seller.addressLine2 || '',
            city: seller.city || '',
            state: seller.state || '',
            country: seller.country || '',
            zipCode: seller.zipCode || '',
          })}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* Add this to your global CSS or Tailwind config if not present: 
.input-bordered-custom { border: 2px solid var(--border, #d1d5db); }
*/
