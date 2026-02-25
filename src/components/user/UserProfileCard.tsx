import React, { useState } from 'react'
import { useUserProfileManagement } from '../../hooks'
import { SellerRegistrationData } from '../../services'

interface UserProfileCardProps {
  className?: string
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ className = '' }) => {
  const {
    user,
    isSeller,
    isAdmin,
    isUpdatingProfile,
    isUpgradingToSeller,
    updateProfile,
    registerAsSeller,
    updateSellerProfile,
  } = useUserProfileManagement()

  const [showSellerForm, setShowSellerForm] = useState(false)
  const [sellerFormData, setSellerFormData] = useState<SellerRegistrationData>({
    businessName: '',
    businessRegistration: '',
    taxId: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    businessDescription: '',
    website: '',
    specializations: [],
  })

  if (!user) {
    return (
      <div className={`rounded-lg shadow-md p-6 ${className}`} style={{ backgroundColor: 'var(--card)' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>Please log in to view your profile</p>
      </div>
    )
  }

  const handleSellerRegistration = async () => {
    try {
      await registerAsSeller(sellerFormData)
      setShowSellerForm(false)
      // Reset form
      setSellerFormData({
        businessName: '',
        businessRegistration: '',
        taxId: '',
        businessAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        businessDescription: '',
        website: '',
        specializations: [],
      })
    } catch (error) {
      console.error('Failed to register as seller:', error)
    }
  }

  const getRoleBadgeStyle = (): React.CSSProperties => {
    if (isAdmin) return { backgroundColor: 'var(--card-gem-bg)', color: 'var(--card-gem-icon-text)' };
    if (isSeller) return { backgroundColor: 'var(--card-diamond-bg)', color: 'var(--card-diamond-icon-text)' };
    return { backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)' };
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${className}`} style={{ backgroundColor: 'var(--card)' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          {user.name}
        </h2>
        <div className="flex gap-2">
          {/* Role Badge */}
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={getRoleBadgeStyle()}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
          
          {/* Verification Badge for Sellers */}
          {isSeller && user.sellerData && (
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: user.sellerData.isVerified ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                color: user.sellerData.isVerified ? 'var(--status-success)' : 'var(--status-warning)'
              }}
            >
              {user.sellerData.isVerified ? 'Verified Seller' : 'Pending Verification'}
            </span>
          )}
        </div>
      </div>

      {/* User Basic Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Email
          </label>
          <p style={{ color: 'var(--foreground)' }}>{user.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Username
          </label>
          <p style={{ color: 'var(--foreground)' }}>@{user.userName}</p>
        </div>

        {user.phone && (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Phone
            </label>
            <p style={{ color: 'var(--foreground)' }}>{user.phone}</p>
          </div>
        )}
      </div>

      {/* Seller Information */}
      {isSeller && user.sellerData && (
        <div className="border-t pt-6 mb-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Seller Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Business Name
              </label>
              <p style={{ color: 'var(--foreground)' }}>{user.sellerData.companyName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Seller Type
              </label>
              <p style={{ color: 'var(--foreground)' }}>{user.sellerData.sellerType}</p>
            </div>
            

          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Regular users can upgrade to seller */}
        {user.role === 'user' && (
          <button
            onClick={() => setShowSellerForm(true)}
            disabled={isUpgradingToSeller}
            className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {isUpgradingToSeller ? 'Registering...' : 'Become a Seller'}
          </button>
        )}
        
        <button
          onClick={() => {/* Open edit profile modal */}}
          disabled={isUpdatingProfile}
          className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
        >
          {isUpdatingProfile ? 'Updating...' : 'Edit Profile'}
        </button>
      </div>

      {/* Seller Registration Form */}
      {showSellerForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Register as Seller
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  value={sellerFormData.businessName}
                  onChange={(e) => setSellerFormData(prev => ({
                    ...prev,
                    businessName: e.target.value
                  }))}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  Business Registration Number *
                </label>
                <input
                  type="text"
                  value={sellerFormData.businessRegistration}
                  onChange={(e) => setSellerFormData(prev => ({
                    ...prev,
                    businessRegistration: e.target.value
                  }))}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  Business Description
                </label>
                <textarea
                  value={sellerFormData.businessDescription}
                  onChange={(e) => setSellerFormData(prev => ({
                    ...prev,
                    businessDescription: e.target.value
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSellerRegistration}
                disabled={isUpgradingToSeller || !sellerFormData.businessName || !sellerFormData.businessRegistration}
                className="flex-1 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                {isUpgradingToSeller ? 'Registering...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowSellerForm(false)}
                disabled={isUpgradingToSeller}
                className="flex-1 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileCard
