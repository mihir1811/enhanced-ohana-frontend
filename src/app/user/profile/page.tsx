'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Shield, Star, Edit3, Save, X, Building, Award, TrendingUp, Loader2, Camera } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateUserProfile, updateUserProfileAsync, updateProfilePictureAsync, setCredentials } from '@/features/auth/authSlice'

export default function UserProfilePage() {
  const dispatch = useAppDispatch()
  const { user, isSeller } = useAppSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Profile picture state
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  
  // Local state for editing form
  const [editForm, setEditForm] = useState({
    name: '',
    userName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  
  // Initialize form data when user data loads or editing starts
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        userName: user.userName,
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      })
    }
  }, [user, isEditing])
  
  // If no user, show loading or redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
          <p className="mt-2 text-sm text-gray-500">
            No user data found. Please log in to view your profile.
          </p>
          <button 
            onClick={() => setTestUserData()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Test User Data
          </button>
        </div>
      </div>
    )
  }

  // Format address for display
  const formatAddress = (address: any) => {
    if (!address) return 'No address provided'
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Check if form data has changes compared to current user data
  const hasChanges = () => {
    if (!user) return false
    
    const hasProfilePictureChange = selectedProfilePicture !== null
    // Only check for changes in fields that can be updated via API
    const hasUserInfoChange = (
      editForm.userName !== user.userName ||
      editForm.phone !== (user.phone || '')
    )
    
    return hasProfilePictureChange || hasUserInfoChange
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSaveMessage(null)
    
    try {
      let hasUpdates = false
      
      // First, update profile picture if a new one was selected
      if (selectedProfilePicture) {
        const pictureResult = await dispatch(updateProfilePictureAsync(selectedProfilePicture))
        
        if (!updateProfilePictureAsync.fulfilled.match(pictureResult)) {
          setSaveMessage({ type: 'error', text: pictureResult.payload as string || 'Failed to update profile picture' })
          setIsLoading(false)
          return
        }
        hasUpdates = true
      }
      
      // Check if user info has changed (only userName and phone for API)
      const hasUserInfoChanges = (
        editForm.userName !== user.userName ||
        editForm.phone !== (user.phone || '')
      )
      
      // Update user info only if there are changes
      if (hasUserInfoChanges) {
        const updateData = {
          userName: editForm.userName,
          phone: editForm.phone
          // Note: Only sending userName and phone to API for now
          // name and address are handled separately or not sent
        }
        
        // Call the async thunk for user info update
        const result = await dispatch(updateUserProfileAsync(updateData))
        
        if (updateUserProfileAsync.fulfilled.match(result)) {
          // Only update Redux state with the fields that were sent to API
          dispatch(updateUserProfile({
            userName: editForm.userName,
            phone: editForm.phone
            // Note: name and address are not updated via API currently
          }))
          hasUpdates = true
        } else {
          setSaveMessage({ type: 'error', text: result.payload as string || 'Failed to update profile' })
          setIsLoading(false)
          return
        }
      }
      
      if (hasUpdates) {
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setSaveMessage({ type: 'success', text: 'No changes to save' })
      }
      
      setIsEditing(false)
      // Clear profile picture selection after successful save
      setSelectedProfilePicture(null)
      setProfilePicturePreview(null)
      
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to current user data
    setEditForm({
      name: user.name,
      userName: user.userName,
      phone: user.phone || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    })
    // Clear profile picture selection
    setSelectedProfilePicture(null)
    setProfilePicturePreview(null)
    setSaveMessage(null)
    setIsEditing(false)
  }

  // Handle profile picture selection
  const handleProfilePictureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSaveMessage({ type: 'error', text: 'Please select a valid image file' })
        return
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveMessage({ type: 'error', text: 'Image file size must be less than 5MB' })
        return
      }
      
      setSelectedProfilePicture(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const handleProfilePictureClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Test function to set sample user data
  const setTestUserData = () => {
    const testUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      userName: 'john_doe',
      phone: '+14155552671',
      address: {
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'USA'
      },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
      isVerified: true,
      role: 'seller' as const,
      sellerData: {
        addressLine1: '456 Business Ave',
        addressLine2: 'Suite 200',
        city: 'San Francisco',
        companyLogo: '',
        companyName: 'Doe Jewelry Co.',
        country: 'USA',
        createdAt: '2024-02-01T00:00:00Z',
        gstNumber: 'GST-REG-123456789',
        id: 'seller-1',
        isBlocked: false,
        isDeleted: false,
        isVerified: true,
        panCard: 'PAN-987654321',
        sellerType: 'retail',
        state: 'CA',
        updatedAt: '2024-12-10T00:00:00Z',
        userId: '1',
        zipCode: '94103',
      },
    }

    dispatch(setCredentials({ user: testUser as any, token: 'test-token-123' }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold tracking-tight"
                style={{ color: 'var(--foreground)' }}
              >
                My Profile
              </h1>
              <p 
                className="mt-2 text-lg"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Manage your account information and preferences.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !hasChanges()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {isLoading 
                        ? 'Saving...' 
                        : hasChanges() 
                          ? 'Save Changes' 
                          : 'No Changes'
                      }
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Success/Error Message */}
          {saveMessage && (
            <div 
              className={`p-4 rounded-lg border ${
                saveMessage.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <p className="text-sm font-medium">{saveMessage.text}</p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-xl border p-6 text-center"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="relative">
                  <div 
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 relative ${
                      isEditing ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''
                    }`}
                    style={{ 
                      background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))',
                      color: 'var(--primary-foreground)'
                    }}
                    onClick={handleProfilePictureClick}
                  >
                    {profilePicturePreview ? (
                      <img 
                        src={profilePicturePreview} 
                        alt="Profile preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user.name.split(' ').map((n: string) => n[0]).join('')
                    )}
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureSelect}
                    className="hidden"
                  />
                  
                  {isEditing && (
                    <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                      Click to change profile picture
                    </p>
                  )}
                </div>
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--card-foreground)' }}
                >
                  {user.name}
                </h2>
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4"
                  style={{ 
                    backgroundColor: user.isVerified ? 'var(--chart-1)' : 'var(--muted)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {user.isVerified ? 'Verified' : 'Unverified'} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Member since</span>
                    <span style={{ color: 'var(--card-foreground)' }}>{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Username</span>
                    <span style={{ color: 'var(--card-foreground)' }}>@{user.userName}</span>
                  </div>
                  {isSeller && user.sellerData && (
                    <>
                      <div className="flex items-center justify-between">
                        <span style={{ color: 'var(--muted-foreground)' }}>Seller Type</span>
                        <span style={{ color: 'var(--card-foreground)' }}>{user.sellerData.sellerType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: 'var(--muted-foreground)' }}>GST Number</span>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" style={{ color: 'var(--chart-3)' }} />
                          <span style={{ color: 'var(--card-foreground)' }}>{user.sellerData.gstNumber}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-xl border p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                  <h3 
                    className="text-lg font-semibold mb-6"
                    style={{ color: 'var(--card-foreground)' }}
                  >
                    Personal Information
                  </h3>
                {isEditing && (
                  <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      <strong>Note:</strong> Currently, only Username and Phone Number can be updated. 
                      Name and Address updates will be available in a future update.
                    </p>
                  </div>
                )}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                      {isEditing && <span className="text-xs opacity-60">(Read-only)</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        disabled={true}
                        className="w-full px-3 py-2 border rounded-lg opacity-50 cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--muted)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--muted-foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {user.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={user.email}
                        disabled={true}
                        className="w-full px-3 py-2 border rounded-lg opacity-50 cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--muted)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--muted-foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <User className="w-4 h-4" />
                      <span>Username</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.userName}
                        onChange={(e) => setEditForm({...editForm, userName: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        style={{ 
                          backgroundColor: 'var(--input)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--foreground)'
                        }}
                        placeholder="Enter username"
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        @{user.userName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        style={{ 
                          backgroundColor: 'var(--input)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {user.phone || 'No phone number provided'}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <MapPin className="w-4 h-4" />
                      <span>Address</span>
                      {isEditing && <span className="text-xs opacity-60">(Read-only)</span>}
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formatAddress(editForm.address)}
                        disabled={true}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg opacity-50 cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--muted)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--muted-foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {formatAddress(user.address)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seller Business Information - Only show for sellers */}
              {isSeller && user.sellerData && (
                <div 
                  className="rounded-xl border p-6 mt-6"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-6 flex items-center space-x-2"
                    style={{ color: 'var(--card-foreground)' }}
                  >
                    <Building className="w-5 h-5" />
                    <span>Business Information</span>
                  </h3>
                  <div className="space-y-6">
                    {/* Business Name */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        <Building className="w-4 h-4" />
                        <span>Company Name</span>
                      </label>
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {user.sellerData.companyName}
                      </p>
                    </div>

                    {/* Business Registration */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        <Award className="w-4 h-4" />
                        <span>GST Number</span>
                      </label>
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {user.sellerData.gstNumber}
                      </p>
                    </div>

                    {/* Business Address */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        <MapPin className="w-4 h-4" />
                        <span>Business Address</span>
                      </label>
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {[
                          user.sellerData.addressLine1,
                          user.sellerData.addressLine2,
                          `${user.sellerData.city}, ${user.sellerData.state} ${user.sellerData.zipCode}`,
                          user.sellerData.country,
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        <Shield className="w-4 h-4" />
                        <span>Verification Status</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.sellerData.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          {user.sellerData.isVerified ? 'Verified Seller' : 'Pending Verification'}
                        </div>
                      </div>
                    </div>

                    {/* Seller Meta */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                          <TrendingUp className="w-4 h-4" />
                          <span>Seller Type</span>
                        </label>
                        <p className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                          {user.sellerData.sellerType}
                        </p>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                          <Calendar className="w-4 h-4" />
                          <span>Joined</span>
                        </label>
                        <p className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                          {formatDate(user.sellerData.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Seller Since */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        <Calendar className="w-4 h-4" />
                        <span>Seller Since</span>
                      </label>
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {formatDate(user.sellerData.createdAt)}
                      </p>
                    </div>

                    {/* Additional fields can be added here as needed */}
                  </div>
                </div>
              )}

              {/* Account Settings */}
              <div 
                className="rounded-xl border p-6 mt-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-6"
                  style={{ color: 'var(--card-foreground)' }}
                >
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--card-foreground)' }}>Email Notifications</h4>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Get notified about order updates and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--card-foreground)' }}>SMS Notifications</h4>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Get SMS updates for urgent notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--card-foreground)' }}>Two-Factor Authentication</h4>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)'
                      }}
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
