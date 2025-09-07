'use client'

import React from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import NavigationUser from '@/components/Navigation/NavigationUser'
import { ArrowRight, Play, Star, Shield, Award, Gem } from 'lucide-react'

export default function JewelryHomePage() {
  return (
    <>
      <NavigationUser />
      
      {/* Hero Section - Clean and Minimal */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-light text-slate-900 mb-8 tracking-tight">
              Timeless
              <span className="block font-serif italic text-slate-700">Elegance</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Discover our curated collection of fine jewelry, 
              crafted with precision and designed to last generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/jewelry/rings" 
                className="group inline-flex items-center bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-all duration-300"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/about-us" 
                className="group inline-flex items-center border-2 border-slate-900 text-slate-900 px-8 py-4 text-lg font-medium hover:bg-slate-900 hover:text-white transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5" />
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jewelry Categories - Grid Layout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Jewelry Categories
            </h2>
            <div className="w-24 h-0.5 bg-slate-900 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Rings',
                subtitle: 'Eternal Symbols',
                emoji: '💍',
                description: 'Engagement, wedding, and fashion rings',
                href: '/jewelry/rings',
                color: 'from-pink-100 to-rose-50'
              },
              {
                title: 'Necklaces',
                subtitle: 'Graceful Adornment',
                emoji: '📿',
                description: 'Chains, pendants, and statement pieces',
                href: '/jewelry/necklaces',
                color: 'from-purple-100 to-violet-50'
              },
              {
                title: 'Earrings',
                subtitle: 'Elegant Details',
                emoji: '👂',
                description: 'Studs, hoops, and drop earrings',
                href: '/jewelry/earrings',
                color: 'from-blue-100 to-sky-50'
              },
              {
                title: 'Bracelets',
                subtitle: 'Wrist Beauty',
                emoji: '🔗',
                description: 'Tennis, chain, and charm bracelets',
                href: '/jewelry/bracelets',
                color: 'from-emerald-100 to-green-50'
              },
              {
                title: 'Watches',
                subtitle: 'Timeless Luxury',
                emoji: '⌚',
                description: 'Luxury timepieces and smart watches',
                href: '/jewelry/watches',
                color: 'from-amber-100 to-yellow-50'
              },
              {
                title: 'Chains',
                subtitle: 'Classic Links',
                emoji: '⛓️',
                description: 'Gold, silver, and platinum chains',
                href: '/jewelry/chains',
                color: 'from-gray-100 to-slate-50'
              },
              {
                title: 'Sets',
                subtitle: 'Perfect Harmony',
                emoji: '💎',
                description: 'Matching jewelry collections',
                href: '/jewelry/sets',
                color: 'from-indigo-100 to-blue-50'
              },
              {
                title: 'Accessories',
                subtitle: 'Finishing Touches',
                emoji: '✨',
                description: 'Cufflinks, pins, and unique pieces',
                href: '/jewelry/accessories',
                color: 'from-rose-100 to-pink-50'
              }
            ].map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  
                  <p className="text-sm uppercase tracking-wider text-slate-600 mb-2 group-hover:text-slate-700">
                    {category.subtitle}
                  </p>
                  
                  <h3 className="text-2xl font-light text-slate-900 mb-3 group-hover:text-slate-800">
                    {category.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 group-hover:text-slate-700 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-slate-900 group-hover:text-slate-800">
                    <span className="text-sm font-medium">Explore {category.title}</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Piece */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-8">
                Crafted to
                <span className="block font-serif italic">Perfection</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Each piece in our collection is meticulously handcrafted by master jewelers, 
                combining traditional techniques with contemporary design to create heirlooms 
                that will be treasured for generations.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Gem className="w-6 h-6" />, text: 'Ethically sourced diamonds' },
                  { icon: <Award className="w-6 h-6" />, text: 'Lifetime craftsmanship warranty' },
                  { icon: <Shield className="w-6 h-6" />, text: 'Certified authenticity' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-slate-700">
                    <div className="mr-4 text-slate-900">
                      {feature.icon}
                    </div>
                    <span className="text-lg">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/about-us" 
                className="inline-flex items-center mt-8 text-slate-900 font-medium hover:text-slate-700 transition-colors"
              >
                Learn About Our Process
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-white rounded-none shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Gem className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-lg">Featured Jewelry Piece</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-light text-slate-700 mb-8 leading-relaxed">
              "The quality and craftsmanship exceeded all expectations. 
              This ring will be passed down through generations."
            </blockquote>
            
            <div>
              <p className="text-lg font-medium text-slate-900">Sarah & Michael</p>
              <p className="text-slate-600">New York</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              Stay Inspired
            </h2>
            
            <p className="text-xl text-slate-300 mb-8">
              Receive updates on new collections and exclusive events.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button className="px-8 py-4 bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
