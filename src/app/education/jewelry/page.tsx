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
          alt="Jewelry Education" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1515562910599-8da1f3b3490?auto=format&fit=crop&w=2000&q=80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary bg-white/90 rounded-full uppercase">
          Jewelry Education
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Master Fine Jewelry
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to jewelry types, styles, settings, and craftsmanship. Learn to choose and care for fine jewelry pieces.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Jewelry Styles
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Setting Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const JewelryTypes = () => {
  const types = [
    {
      name: "Rings",
      description: "Engagement, wedding, fashion, and statement rings",
      icon: "💍",
      styles: ["Solitaire", "Halo", "Three Stone", "Eternity", "Cocktail"],
      popularity: "Most Popular"
    },
    {
      name: "Necklaces",
      description: "Chains, pendants, and statement necklaces",
      icon: "📿",
      styles: ["Chain", "Pendant", "Locket", "Choker", "Opera Length"],
      popularity: "Very Popular"
    },
    {
      name: "Earrings",
      description: "Studs, hoops, drops, and chandelier styles",
      icon: "👂",
      styles: ["Stud", "Hoop", "Drop", "Chandelier", "Huggie"],
      popularity: "Very Popular"
    },
    {
      name: "Bracelets",
      description: "Chains, bangles, cuffs, and charm bracelets",
      icon: "⌚",
      styles: ["Chain", "Bangle", "Cuff", "Charm", "Tennis"],
      popularity: "Popular"
    },
    {
      name: "Pendants",
      description: "Lockets, medallions, and decorative pendants",
      icon: "🔮",
      styles: ["Locket", "Medallion", "Cross", "Heart", "Geometric"],
      popularity: "Popular"
    },
    {
      name: "Brooches",
      description: "Decorative pins for clothing and accessories",
      icon: "🎀",
      styles: ["Floral", "Animal", "Geometric", "Vintage", "Modern"],
      popularity: "Classic"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Jewelry Types & Styles
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Explore different jewelry categories and discover the perfect style for every occasion and personal preference.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {types.map((type, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <span className="text-2xl">{type.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{type.name}</h3>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {type.popularity}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {type.description}
                    </p>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Popular Styles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {type.styles.slice(0, 4).map((style, styleIndex) => (
                          <span key={styleIndex} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
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

const SettingsGuide = () => {
  const settings = [
    {
      name: "Prong Setting",
      description: "Metal claws hold the gemstone, maximizing light exposure",
      bestFor: "Showing brilliance, easy cleaning",
      styles: ["4-prong", "6-prong", "8-prong", "Cathedral"],
      security: "Good"
    },
    {
      name: "Bezel Setting",
      description: "Metal rim surrounds the gemstone completely",
      bestFor: "Protecting stones, modern look",
      styles: ["Full bezel", "Partial bezel", "Split bezel"],
      security: "Excellent"
    },
    {
      name: "Tension Setting",
      description: "Gemstone held by pressure of metal tension",
      bestFor: "Modern appearance, maximum light",
      styles: ["Classic tension", "Floating tension"],
      security: "Moderate"
    },
    {
      name: "Pavé Setting",
      description: "Small gemstones set closely together like pavement",
      bestFor: "Adding sparkle, vintage look",
      styles: ["Micro pavé", "French pavé", "Scalloped pavé"],
      security: "Good"
    },
    {
      name: "Channel Setting",
      description: "Gemstones set in metal channel",
      bestFor: "Protecting stones, smooth appearance",
      styles: ["Single channel", "Multiple channel"],
      security: "Excellent"
    },
    {
      name: "Halo Setting",
      description: "Center stone surrounded by circle of smaller stones",
      bestFor: "Adding sparkle, larger appearance",
      styles: ["Classic halo", "Double halo", "Hidden halo"],
      security: "Good"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Jewelry Setting Guide
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Understanding different jewelry settings helps you choose the perfect style for security, appearance, and lifestyle.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {settings.map((setting, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{setting.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {setting.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Best For:</strong> {setting.bestFor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Security:</strong> {setting.security}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Styles:</strong> {setting.styles.join(", ")}
                    </span>
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

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
        Find Your Perfect Jewelry
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of fine jewelry and discover pieces that express your unique style and story.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Jewelry
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Style Consultation
        </Button>
      </div>
    </div>
  </section>
);

export default function JewelryEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <JewelryTypes />
          <SettingsGuide />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
