'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Shield, Star, Edit3, Save, X } from 'lucide-react'

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    joinDate: 'March 2023',
    membershipTier: 'Premium',
    totalOrders: 12,
    totalSpent: '$24,850',
    averageRating: 4.8
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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
                <div 
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--card-foreground)' }}
                >
                  {profileData.name}
                </h2>
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4"
                  style={{ 
                    backgroundColor: 'var(--chart-1)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {profileData.membershipTier} Member
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Member since</span>
                    <span style={{ color: 'var(--card-foreground)' }}>{profileData.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Total Orders</span>
                    <span style={{ color: 'var(--card-foreground)' }}>{profileData.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Total Spent</span>
                    <span style={{ color: 'var(--chart-1)' }}>{profileData.totalSpent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" style={{ color: 'var(--chart-3)' }} />
                      <span style={{ color: 'var(--card-foreground)' }}>{profileData.averageRating}</span>
                    </div>
                  </div>
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
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        style={{ 
                          backgroundColor: 'var(--input)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {profileData.name}
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
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        style={{ 
                          backgroundColor: 'var(--input)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {profileData.email}
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
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        style={{ 
                          backgroundColor: 'var(--input)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {profileData.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <MapPin className="w-4 h-4" />
                      <span>Address</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg"
                        style={{ 
                          backgroundColor: 'var(--input)', 
                          borderColor: 'var(--border)', 
                          color: 'var(--foreground)'
                        }}
                      />
                    ) : (
                      <p className="text-lg" style={{ color: 'var(--card-foreground)' }}>
                        {profileData.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
