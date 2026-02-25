"use client";

import NavigationUser from "@/components/Navigation/NavigationUser";
import Footer from "@/components/Footer";
import { SECTION_WIDTH } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 opacity-60">
        <img 
          alt="Gemstone Education" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=2000&q=80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary bg-white/90 rounded-full uppercase">
          Gemstone Education
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Discover Colored Gemstones
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to gemstone types, properties, meanings, and care. From birthstones to rare stones, master the world of colored gems.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Explore Gemstones
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Birthstone Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const GemstoneTypes = () => {
  const gemstones = [
    {
      name: "Ruby",
      color: "Red",
      hardness: "9.0",
      birthstone: "July",
      meaning: "Passion, courage, devotion",
      rarity: "Rare",
      image: "https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Sapphire",
      color: "Blue",
      hardness: "9.0",
      birthstone: "September",
      meaning: "Wisdom, royalty, faith",
      rarity: "Precious",
      image: "https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Emerald",
      color: "Green",
      hardness: "7.5-8.0",
      birthstone: "May",
      meaning: "Growth, renewal, prosperity",
      rarity: "Very Rare",
      image: "https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Amethyst",
      color: "Purple",
      hardness: "7.0",
      birthstone: "February",
      meaning: "Clarity, peace, sobriety",
      rarity: "Semi-Precious",
      image: "https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Aquamarine",
      color: "Light Blue",
      hardness: "7.5-8.0",
      birthstone: "March",
      meaning: "Courage, health, serenity",
      rarity: "Semi-Precious",
      image: "https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Topaz",
      color: "Yellow/Golden",
      hardness: "8.0",
      birthstone: "November",
      meaning: "Love, affection, strength",
      rarity: "Semi-Precious",
      image: "https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Popular Gemstone Types
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Explore the world of colored gemstones, their properties, meanings, and what makes each stone unique and special.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gemstones.map((gemstone, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={gemstone.image} 
                      alt={gemstone.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{gemstone.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        gemstone.rarity === 'Precious' ? 'bg-red-100 text-red-700' :
                        gemstone.rarity === 'Very Rare' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {gemstone.rarity}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Color:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{gemstone.color}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Hardness:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{gemstone.hardness}</span>
                      </div>
                    </div>
                    <div className="text-sm mb-3">
                      <span className="text-slate-500 dark:text-slate-400">Birthstone:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{gemstone.birthstone}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      <span className="font-medium">Meaning:</span> {gemstone.meaning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const BirthstoneGuide = () => {
  const months = [
    { month: "January", stone: "Garnet", color: "Deep Red", meaning: "Friendship, trust" },
    { month: "February", stone: "Amethyst", color: "Purple", meaning: "Peace, clarity" },
    { month: "March", stone: "Aquamarine", color: "Light Blue", meaning: "Courage, health" },
    { month: "April", stone: "Diamond", color: "Colorless", meaning: "Love, eternity" },
    { month: "May", stone: "Emerald", color: "Green", meaning: "Growth, renewal" },
    { month: "June", stone: "Pearl/Alexandrite", color: "White/Purple", meaning: "Love, health" },
    { month: "July", stone: "Ruby", color: "Red", meaning: "Passion, courage" },
    { month: "August", stone: "Peridot", color: "Lime Green", meaning: "Strength, influence" },
    { month: "September", stone: "Sapphire", color: "Blue", meaning: "Wisdom, royalty" },
    { month: "October", stone: "Opal/Tourmaline", color: "Multi-color", meaning: "Hope, creativity" },
    { month: "November", stone: "Topaz/Citrine", color: "Yellow/Orange", meaning: "Love, affection" },
    { month: "December", stone: "Turquoise/Tanzanite", color: "Blue/Green", meaning: "Success, fortune" }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Birthstone Guide
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Discover your birthstone and its special meaning. Each month has a unique gemstone with rich symbolism and history.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {months.map((month, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{month.month}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{month.stone}</p>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-2"></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">{month.meaning}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
        Find Your Perfect Gemstone
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of fine gemstone jewelry and discover the perfect stone that speaks to you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Gemstones
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Gemstone Expert
        </Button>
      </div>
    </div>
  </section>
);

export default function GemstoneEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <GemstoneTypes />
          <BirthstoneGuide />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
