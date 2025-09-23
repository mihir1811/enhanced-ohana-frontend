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
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <p className="text-gray-500">Please log in to view your profile</p>
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

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {user.name}
        </h2>
        <div className="flex gap-2">
          {/* Role Badge */}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isAdmin 
              ? 'bg-purple-100 text-purple-800' 
              : isSeller 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
          }`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
          
          {/* Verification Badge for Sellers */}
          {isSeller && user.sellerData && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.sellerData.isVerified
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.sellerData.isVerified ? 'Verified Seller' : 'Pending Verification'}
            </span>
          )}
        </div>
      </div>

      {/* User Basic Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <p className="text-gray-900">@{user.userName}</p>
        </div>

        {user.phone && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <p className="text-gray-900">{user.phone}</p>
          </div>
        )}
      </div>

      {/* Seller Information */}
      {isSeller && user.sellerData && (
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Seller Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <p className="text-gray-900">{user.sellerData.companyName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seller Type
              </label>
              <p className="text-gray-900">{user.sellerData.sellerType}</p>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpgradingToSeller ? 'Registering...' : 'Become a Seller'}
          </button>
        )}
        
        <button
          onClick={() => {/* Open edit profile modal */}}
          disabled={isUpdatingProfile}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdatingProfile ? 'Updating...' : 'Edit Profile'}
        </button>
      </div>

      {/* Seller Registration Form */}
      {showSellerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Register as Seller
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={sellerFormData.businessName}
                  onChange={(e) => setSellerFormData(prev => ({
                    ...prev,
                    businessName: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Registration Number *
                </label>
                <input
                  type="text"
                  value={sellerFormData.businessRegistration}
                  onChange={(e) => setSellerFormData(prev => ({
                    ...prev,
                    businessRegistration: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description
                </label>
                <textarea
                  value={sellerFormData.businessDescription}
                  onChange={(e) => setSellerFormData(prev => ({
                    ...prev,
                    businessDescription: e.target.value
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSellerRegistration}
                disabled={isUpgradingToSeller || !sellerFormData.businessName || !sellerFormData.businessRegistration}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpgradingToSeller ? 'Registering...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowSellerForm(false)}
                disabled={isUpgradingToSeller}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
