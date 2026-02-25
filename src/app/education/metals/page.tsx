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
          alt="Metal Education" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1615655988625-3ba2b3e6e09a?auto=format&fit=crop&w=2000&q=80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary bg-white/90 rounded-full uppercase">
          Metal Education
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Master Precious Metals
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to precious metals: properties, purity, hallmarks, and care. Learn to choose and maintain fine metal jewelry.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Metal Types
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Purity Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const MetalTypes = () => {
  const metals = [
    {
      name: "Gold",
      symbol: "Au",
      purity: "24K, 22K, 18K, 14K, 10K",
      color: "Yellow",
      hardness: "2.5-3",
      properties: ["Malleable", "Hypoallergenic", "Timeless"],
      bestFor: "Engagement rings, wedding bands"
    },
    {
      name: "Platinum",
      symbol: "Pt",
      purity: "950, 900",
      color: "White",
      hardness: "4-4.5",
      properties: ["Durable", "Hypoallergenic", "Rare"],
      bestFor: "Engagement settings, prongs"
    },
    {
      name: "Silver",
      symbol: "Ag",
      purity: "999, 925, 800",
      color: "White",
      hardness: "2.5-3",
      properties: ["Affordable", "Malleable", "Classic"],
      bestFor: "Fashion jewelry, casual wear"
    },
    {
      name: "Palladium",
      symbol: "Pd",
      purity: "950",
      color: "White",
      hardness: "4.75",
      properties: ["Lightweight", "Durable", "Hypoallergenic"],
      bestFor: "Wedding bands, modern settings"
    },
    {
      name: "Titanium",
      symbol: "Ti",
      purity: "Commercially Pure",
      color: "Gray",
      hardness: "6",
      properties: ["Strong", "Lightweight", "Hypoallergenic"],
      bestFor: "Men's jewelry, wedding bands"
    },
    {
      name: "Tungsten",
      symbol: "W",
      purity: "85-95%",
      color: "Gray",
      hardness: "8-9",
      properties: ["Scratch resistant", "Affordable", "Modern"],
      bestFor: "Men's wedding bands, fashion"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Precious Metal Types
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Compare different precious metals and their unique properties to choose the perfect material for your jewelry needs.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {metals.map((metal, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl font-bold">{metal.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{metal.name}</h3>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                        {metal.color}
                      </span>
                    </div>
                    <div className="text-sm mb-3">
                      <span className="text-slate-500 dark:text-slate-400">Purity:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{metal.purity}</span>
                    </div>
                    <div className="text-sm mb-3">
                      <span className="text-slate-500 dark:text-slate-400">Hardness:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{metal.hardness}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {metal.properties.join(" • ")}
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <strong>Best For:</strong> {metal.bestFor}
                      </p>
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

const PurityGuide = () => {
  const goldPurities = [
    { karat: "24K", percentage: "99.9%", description: "Pure gold, very soft, not recommended for daily wear" },
    { karat: "22K", percentage: "91.7%", description: "Very high purity, good for fine jewelry" },
    { karat: "18K", percentage: "75%", description: "Excellent balance of purity and durability" },
    { karat: "14K", percentage: "58.3%", description: "Most popular for engagement rings, good durability" },
    { karat: "10K", percentage: "41.7%", description: "Very durable, affordable, slight yellow tint" }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Metal Purity
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Metal purity indicates the percentage of precious metal content. Higher purity means more value but often less durability.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goldPurities.map((purity, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${purity.karat === "18K" ? "ring-2 ring-amber-500/20 border-amber-500/30" : ""}`}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4">
                  <span className="text-xl font-bold">{purity.karat}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{purity.karat} Gold</h3>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3">{purity.percentage}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {purity.description}
                </p>
                {purity.karat === "18K" && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            <strong>💡 Expert Tip:</strong> 18K gold offers the best balance of purity and durability for most jewelry types, especially engagement rings.
          </p>
        </div>
      </div>
    </section>
  );
};

const HallmarksGuide = () => {
  const hallmarks = [
    { symbol: "750", description: "18K gold (75% pure)", country: "International" },
    { symbol: "585", description: "14K gold (58.3% pure)", country: "International" },
    { symbol: "375", description: "9K gold (37.5% pure)", country: "International" },
    { symbol: "950", description: "Platinum (95% pure)", country: "International" },
    { symbol: "925", description: "Sterling silver (92.5% pure)", country: "International" },
    { symbol: "Au750", description: "18K gold (Swiss marking)", country: "Switzerland" },
    { symbol: "Pt950", description: "Platinum (95% pure)", country: "International" }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Hallmarks
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Hallmarks are official stamps indicating metal purity and origin. Learn to read these marks to verify authenticity.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hallmarks.map((hallmark, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-slate-100 dark:bg-slate-950 rounded-lg flex items-center justify-center mb-3 font-mono text-lg font-bold text-slate-700 dark:text-slate-300">
                  {hallmark.symbol}
                </div>
                <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">{hallmark.description}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{hallmark.country}</p>
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
        Choose Your Perfect Metal
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of fine metal jewelry and discover the perfect material for your style and lifestyle.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Metal Jewelry
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Metal Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function MetalEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <MetalTypes />
          <PurityGuide />
          <HallmarksGuide />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
