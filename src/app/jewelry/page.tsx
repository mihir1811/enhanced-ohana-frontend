'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import NavigationUser from '@/components/Navigation/NavigationUser'
import { ArrowRight, Play, Star, Shield, Award, Gem, ChevronLeft, ChevronRight } from 'lucide-react'

// Hero Carousel Slides
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Exquisite Rings',
    subtitle: 'Timeless Elegance',
    description: 'Fine jewelry crafted with precision and designed to last generations',
    image: '/images/jewelryCategoryImages/ring.webp',
    cta: 'Shop Rings',
    ctaLink: '/jewelry/rings',
    bgGradient: 'from-amber-50 via-rose-50 to-white'
  },
  {
    id: 2,
    title: 'Elegant Necklaces',
    subtitle: 'Statement Pieces',
    description: 'Stunning necklaces that elevate any outfit with sophisticated charm',
    image: '/images/jewelryCategoryImages/necklace.webp',
    cta: 'View Necklaces',
    ctaLink: '/jewelry/necklaces',
    bgGradient: 'from-blue-50 via-indigo-50 to-white'
  },
  {
    id: 3,
    title: 'Beautiful Earrings',
    subtitle: 'Elegant Designs',
    description: 'Premium earrings that combine sophistication with timeless style',
    image: '/images/jewelryCategoryImages/earrings.webp',
    cta: 'Explore Earrings',
    ctaLink: '/jewelry/earrings',
    bgGradient: 'from-slate-50 via-gray-50 to-white'
  },
  {
    id: 4,
    title: 'Stunning Bracelets',
    subtitle: 'Wrist Elegance',
    description: 'Handcrafted bracelets that add a touch of luxury to your style',
    image: '/images/jewelryCategoryImages/bracelet.webp',
    cta: 'Shop Bracelets',
    ctaLink: '/jewelry/bracelets',
    bgGradient: 'from-emerald-50 via-teal-50 to-white'
  },
  {
    id: 5,
    title: 'Complete Jewelry Sets',
    subtitle: 'Perfect Harmony',
    description: 'Coordinated jewelry sets for a perfectly matched look',
    image: '/images/jewelryCategoryImages/set.webp',
    cta: 'View Sets',
    ctaLink: '/jewelry/sets',
    bgGradient: 'from-purple-50 via-pink-50 to-white'
  }
];

export default function JewelryHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Scroll functions for category section
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setIsAutoPlaying(false);
  };

  return (
    <>
      <NavigationUser />
      
      {/* Simple Hero Carousel - Image Above, Content Below */}
      <section className="relative bg-white dark:bg-gray-900">
        {/* Slides Container */}
        <div className="relative">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              {/* Image Section */}
              <div className="relative h-[60vh] md:h-[70vh] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Navigation Arrows on Image */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>

                {/* Slide Indicators on Image */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === currentSlide
                          ? 'w-12 h-3 bg-white'
                          : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content Section Below */}
              <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 py-16">
                <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-amber-100 dark:border-amber-800 mb-6">
                      <Gem className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Premium Collection</span>
                    </div>

                    {/* Title */}
                    <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? 'block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent' : 'block'}>
                          {word}
                        </span>
                      ))}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                      <Link
                        href={slide.ctaLink}
                        className="group inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href="/about-us"
                        className="group inline-flex items-center justify-center border-2 border-gray-900 dark:border-amber-500 text-gray-900 dark:text-amber-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-900 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all duration-300"
                      >
                        <Play className="mr-2 w-5 h-5" />
                        Our Story
                      </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="font-medium">Certified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="font-medium">Warranty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gem className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="font-medium">Ethically Sourced</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category - Horizontal Scroll */}
      <section className="py-12  dark:bg-gray-900">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Browse our jewelry collections</p>
          </div>

          {/* Scrollable Categories with Arrow Navigation */}
          <div className="relative px-12">
            {/* Left Scroll Arrow */}
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-500 group"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </button>

            {/* Right Scroll Arrow */}
            <button
              onClick={scrollRight}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-500 group"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto overflow-y-visible pb-0 scrollbar-hide snap-x snap-mandatory scroll-smooth px-4"
            >
              {[
                {
                  title: 'Rings',
                  image: '/images/jewelryCategoryImages/ring.webp',
                  href: '/jewelry/rings',
                  bgColor: 'from-pink-100 to-rose-100'
                },
                {
                  title: 'Necklaces',
                  image: '/images/jewelryCategoryImages/necklace.webp',
                  href: '/jewelry/necklaces',
                  bgColor: 'from-purple-100 to-violet-100'
                },
                {
                  title: 'Earrings',
                  image: '/images/jewelryCategoryImages/earrings.webp',
                  href: '/jewelry/earrings',
                  bgColor: 'from-blue-100 to-sky-100'
                },
                {
                  title: 'Bracelets',
                  image: '/images/jewelryCategoryImages/bracelet.webp',
                  href: '/jewelry/bracelets',
                  bgColor: 'from-emerald-100 to-green-100'
                },
                {
                  title: 'Jewelry Sets',
                  image: '/images/jewelryCategoryImages/set.webp',
                  href: '/jewelry',
                  bgColor: 'from-rose-100 to-pink-100'
                },
                {
                  title: 'Chains',
                  image: '/images/jewelryCategoryImages/necklace.webp',
                  href: '/jewelry/chains',
                  bgColor: 'from-gray-100 to-slate-100'
                },
                {
                  title: 'Watches',
                  image: '/images/jewelryCategoryImages/set.webp',
                  href: '/jewelry/watches',
                  bgColor: 'from-amber-100 to-yellow-100'
                },
                {
                  title: 'Accessories',
                  image: '/images/jewelryCategoryImages/earrings.webp',
                  href: '/jewelry/accessories',
                  bgColor: 'from-rose-100 to-pink-100'
                }
              ].map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="group flex-shrink-0 snap-center"
                >
                  <div className="flex flex-col items-center gap-5 w-52 py-6">
                    {/* Circular Image Container with overflow space */}
                    <div className="relative w-48 h-48 rounded-full overflow-visible">
                      <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl dark:shadow-gray-800 dark:group-hover:shadow-gray-700 group-hover:scale-105 ring-4 ring-white dark:ring-gray-700 group-hover:ring-amber-200 dark:group-hover:ring-amber-500 transition-all duration-300">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    
                    {/* Category Title */}
                    <p className="text-center text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {category.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Piece */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Our Craftsmanship</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Crafted to
                <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Perfection
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Each piece in our collection is meticulously handcrafted by master jewelers, 
                combining traditional techniques with contemporary design to create heirlooms 
                that will be treasured for generations.
              </p>
              
              <div className="space-y-5 mb-10">
                {[
                  { icon: <Gem className="w-6 h-6" />, text: 'Ethically Sourced Diamonds', desc: 'Conflict-free and traceable' },
                  { icon: <Award className="w-6 h-6" />, text: 'Lifetime Warranty', desc: 'Guaranteed craftsmanship' },
                  { icon: <Shield className="w-6 h-6" />, text: 'Certified Authenticity', desc: 'Full documentation included' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{feature.text}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/about-us" 
                className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-amber-600 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Learn About Our Process
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square bg-gradient-to-br from-amber-100 via-yellow-50 to-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-3xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden relative">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-400 dark:border-amber-500 rounded-full" />
                  <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-yellow-400 dark:border-yellow-500 rounded-full" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <Gem className="w-32 h-32 text-amber-400 dark:text-amber-500 animate-pulse" />
                      <div className="absolute inset-0 bg-amber-300 dark:bg-amber-500 blur-3xl opacity-30 animate-pulse" />
                    </div>
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Featured Jewelry</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Discover our premium collection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10">
          <div className="absolute top-10 left-1/4 text-9xl text-gray-900 dark:text-white">&ldquo;</div>
          <div className="absolute bottom-10 right-1/4 text-9xl text-gray-900 dark:text-white">&rdquo;</div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Clients Say
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto rounded-full" />
            </div>

            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-amber-50 to-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 md:p-12 border border-amber-100 dark:border-amber-900/30">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400 mx-0.5" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 dark:text-gray-100 mb-8 leading-relaxed text-center">
                &ldquo;The quality and craftsmanship exceeded all expectations. 
                This ring will be passed down through generations. The attention to detail 
                and personalized service made our experience truly memorable.&rdquo;
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">
                  S&M
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Sarah & Michael</p>
                  <p className="text-gray-600 dark:text-gray-400">New York, USA</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 text-center">
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">4.9</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">25+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_70%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-6">
              <Gem className="w-8 h-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Stay Inspired
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join our exclusive community and be the first to discover new collections, 
              special offers, and insider jewelry trends.
            </p>
            
            {/* Newsletter Form */}
            <div className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-2xl">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none rounded-lg"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-amber-400 mb-2">✨</div>
                <p className="text-sm text-gray-300">Exclusive Previews</p>
              </div>
              <div className="text-center">
                <div className="text-amber-400 mb-2">🎁</div>
                <p className="text-sm text-gray-300">Special Offers</p>
              </div>
              <div className="text-center">
                <div className="text-amber-400 mb-2">💎</div>
                <p className="text-sm text-gray-300">Style Tips</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
