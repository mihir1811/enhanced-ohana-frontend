'use client'

import { useState } from 'react'
import { Star, Filter, Edit, Trash2, ThumbsUp, MessageCircle } from 'lucide-react'

export default function UserReviewsPage() {
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'pending'>('my-reviews')
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: '3.2ct Oval Diamond Ring',
      productImage: '💎',
      rating: 5,
      title: 'Absolutely stunning ring!',
      content: 'I am beyond thrilled with this purchase. The diamond is brilliant and the setting is exactly as described. My fiancé loves it and it exceeded all our expectations. The certification gave us confidence in our purchase.',
      date: '2024-12-15',
      verified: true,
      helpful: 23,
      seller: 'DiamondCraft Jewelry',
      sellerResponse: {
        content: 'Thank you so much for your wonderful review! We\'re delighted that you love your ring. Congratulations on your engagement!',
        date: '2024-12-16'
      },
      images: ['📸', '📸']
    },
    {
      id: 2,
      productName: 'Ruby Tennis Necklace',
      productImage: '❤️',
      rating: 4,
      title: 'Beautiful necklace, minor packaging issue',
      content: 'The necklace itself is gorgeous and the rubies have such a rich color. The craftsmanship is excellent. Only issue was the packaging was a bit damaged when it arrived, but the product was perfectly fine.',
      date: '2024-12-10',
      verified: true,
      helpful: 8,
      seller: 'Luxury Gems Co.',
      sellerResponse: null,
      images: ['📸']
    },
    {
      id: 3,
      productName: 'Emerald Halo Earrings',
      productImage: '💚',
      rating: 5,
      title: 'Perfect for special occasions',
      content: 'These earrings are absolutely beautiful. The emeralds are vibrant and the halo setting makes them sparkle wonderfully. I\'ve received so many compliments when wearing them.',
      date: '2024-11-28',
      verified: true,
      helpful: 15,
      seller: 'Premium Stones',
      sellerResponse: {
        content: 'We\'re so happy you love your earrings! Thank you for choosing Premium Stones.',
        date: '2024-11-29'
      },
      images: []
    }
  ])

  const [pendingReviews] = useState([
    {
      id: 4,
      productName: 'Sapphire Eternity Band',
      productImage: '💙',
      orderDate: '2024-12-20',
      deliveredDate: '2024-12-22',
      seller: 'Classic Jewelry'
    },
    {
      id: 5,
      productName: 'Pearl Drop Necklace',
      productImage: '🤍',
      orderDate: '2024-12-18',
      deliveredDate: '2024-12-21',
      seller: 'Ocean Pearls'
    }
  ])

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          />
        ))}
      </div>
    )
  }

  const deleteReview = (id: number) => {
    setReviews(reviews.filter(review => review.id !== id))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              My Reviews
            </h1>
            <p 
              className="mt-2 text-lg"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Share your experience and help other customers
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: 'var(--border)' }}>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('my-reviews')}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'my-reviews' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  borderBottomColor: activeTab === 'my-reviews' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'my-reviews' ? 'var(--primary)' : 'var(--muted-foreground)'
                }}
              >
                My Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'pending' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  borderBottomColor: activeTab === 'pending' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'pending' ? 'var(--primary)' : 'var(--muted-foreground)'
                }}
              >
                Pending Reviews ({pendingReviews.length})
              </button>
            </nav>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  backgroundColor: 'transparent'
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filter by Rating</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span>Sort by:</span>
              <select 
                className="bg-transparent border-none text-sm"
                style={{ color: 'var(--foreground)' }}
              >
                <option>Most Recent</option>
                <option>Oldest First</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'my-reviews' ? (
            /* My Reviews */
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border p-6"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <span className="text-2xl">{review.productImage}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--card-foreground)' }}>
                          {review.productName}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Purchased from {review.seller}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          {review.verified && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: 'var(--chart-1)',
                                color: 'var(--primary-foreground)'
                              }}
                            >
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteReview(review.id)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
                      {review.title}
                    </h4>
                    <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {review.content}
                    </p>
                  </div>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex items-center space-x-3 mb-4">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'var(--muted)' }}
                        >
                          <span className="text-2xl">{image}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {review.helpful} found helpful
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {review.sellerResponse ? '1 response' : 'No responses'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Seller Response */}
                  {review.sellerResponse && (
                    <div 
                      className="mt-4 p-4 rounded-lg border-l-4"
                      style={{ 
                        backgroundColor: 'var(--muted)',
                        borderLeftColor: 'var(--primary)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--primary)' }}>
                          Response from {review.seller}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {new Date(review.sellerResponse.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--card-foreground)' }}>
                        {review.sellerResponse.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Pending Reviews */
            <div className="space-y-6">
              {pendingReviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-6"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <span className="text-2xl">{item.productImage}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--card-foreground)' }}>
                          {item.productName}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Purchased from {item.seller}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Delivered on {new Date(item.deliveredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="px-6 py-2 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)'
                      }}
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingReviews.length === 0 && (
                <div 
                  className="text-center py-16 rounded-xl border"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
                    No pending reviews
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    You&apos;re all caught up! New items will appear here after delivery.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
