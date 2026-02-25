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
          alt="Diamond Carat Education" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1615655988625-3ba2b3e6e09a?auto=format&fit=crop&w=2000&q=80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary bg-white/90 rounded-full uppercase">
          Diamond Education
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Diamond Carat Weight
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to diamond carat weight, size comparison, and how carat affects price and appearance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Carat Guide
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Size Chart
          </Button>
        </div>
      </div>
    </section>
  );
};

const CaratBasicsSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Carat Weight
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Carat measures diamond weight, not size. Learn how carat relates to appearance and value.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-blue-50 dark:bg-blue-950 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">What is a Carat?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Weight Measurement</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      One carat equals 200 milligrams (0.2 grams). It's a unit of weight, not size.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Points System</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      One carat = 100 points. A 0.50 carat diamond is 50 points.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Size vs Weight</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Carat doesn't equal size. Cut quality affects how large a diamond appears.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950 p-8 rounded-xl border border-green-200 dark:border-green-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Carat & Price</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">$</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Price Per Carat</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Larger diamonds cost more per carat due to rarity. Price increases exponentially.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">✨</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Magic Numbers</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Prices jump at 1.00, 1.50, 2.00 carats. Just under these weights saves money.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">⚖️</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Value Factors</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Carat is important but cut, color, and clarity also affect value significantly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const SizeComparisonSection = () => {
  const sizes = [
    { carat: "0.25", diameter: "4.1mm", description: "Small accent stone", commonUse: "Side stones, earrings" },
    { carat: "0.50", diameter: "5.1mm", description: "Classic small diamond", commonUse: "Pendants, small rings" },
    { carat: "0.75", diameter: "5.8mm", description: "Medium size", commonUse: "Engagement rings" },
    { carat: "1.00", diameter: "6.5mm", description: "Standard engagement size", commonUse: "Engagement rings" },
    { carat: "1.50", diameter: "7.4mm", description: "Large impressive size", commonUse: "Statement pieces" },
    { carat: "2.00", diameter: "8.2mm", description: "Very large diamond", commonUse: "Luxury jewelry" },
    { carat: "3.00", diameter: "9.4mm", description: "Exceptional size", commonUse: "High-end jewelry" }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Carat Size Comparison
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Visual comparison of diamond sizes and their typical uses in jewelry.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sizes.map((size, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4">
                  <div 
                    className="w-20 h-20 mx-auto rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center"
                    style={{ 
                      width: `${Math.min(80, parseFloat(size.diameter.replace('mm', '')) * 10)}px`,
                      height: `${Math.min(80, parseFloat(size.diameter.replace('mm', '')) * 10)}px`
                    }}
                  >
                    <span className="text-2xl text-slate-400">💎</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{size.carat} ct</span>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Diameter:</span> {size.diameter}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Size:</span> {size.description}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Use:</span> {size.commonUse}
                  </div>
                </div>
                
                {size.carat === "1.00" && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PriceJumpSection = () => {
  const priceJumps = [
    {
      caratRange: "0.90-0.99 ct",
      description: "Just under 1 carat",
      pricePerCarat: "$4,000-6,000",
      totalCost: "$3,600-5,940",
      savings: "20-30% less than 1.00ct",
      recommendation: "Excellent value"
    },
    {
      caratRange: "1.00-1.09 ct",
      description: "Just over 1 carat",
      pricePerCarat: "$6,000-8,500",
      totalCost: "$6,000-9,265",
      savings: "Premium price",
      recommendation: "Standard choice"
    },
    {
      caratRange: "1.45-1.49 ct",
      description: "Just under 1.5 carats",
      pricePerCarat: "$7,000-9,500",
      totalCost: "$10,150-14,155",
      savings: "15-25% less than 1.50ct",
      recommendation: "Smart choice"
    },
    {
      caratRange: "1.50-1.59 ct",
      description: "Just over 1.5 carats",
      pricePerCarat: "$9,000-12,000",
      totalCost: "$13,500-19,080",
      savings: "Significant premium",
      recommendation: "Luxury choice"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Price Jumps
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Diamond prices jump significantly at "magic numbers." Learn how to save money without sacrificing size.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {priceJumps.map((jump, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${
              jump.caratRange.includes("0.90-0.99") || jump.caratRange.includes("1.45-1.49") ? 
              "ring-2 ring-green-500/20 border-green-500/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{jump.caratRange}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    jump.recommendation === "Excellent value" || jump.recommendation === "Smart choice" ?
                    "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {jump.recommendation}
                  </span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {jump.description}
                </p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Price/Carat:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{jump.pricePerCarat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Cost:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{jump.totalCost}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Savings:</strong> {jump.savings}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            <strong>💡 Expert Tip:</strong> Buying just under magic numbers (0.95ct instead of 1.00ct, 1.45ct instead of 1.50ct) can save 20-30% with no visible difference in size.
          </p>
        </div>
      </div>
    </section>
  );
};

const ExpertTipsSection = () => {
  const tips = [
    {
      title: "Size vs Carat Confusion",
      description: "Carat is weight, not size. A well-cut 0.90ct diamond can look larger than a poorly cut 1.00ct.",
      icon: "💎"
    },
    {
      title: "Magic Number Savings",
      description: "Prices jump at 1.00, 1.50, 2.00 carats. Buy just under these weights for significant savings.",
      icon: "💰"
    },
    {
      title: "Consider Hand Size",
      description: "Larger carats look smaller on larger hands. Consider hand size when choosing carat weight.",
      icon: "✋"
    },
    {
      title: "Balance All 4Cs",
      description: "Don't sacrifice cut quality for carat weight. A well-cut smaller diamond often looks better than a poorly cut larger one.",
      icon: "⚖️"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Expert Carat Tips
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Professional advice for choosing the perfect diamond carat weight.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((tip, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <span className="text-2xl">{tip.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{tip.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {tip.description}
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

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
        Find Your Perfect Carat
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use your carat knowledge to select diamonds with the perfect size and value for your budget.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Search by Carat Weight
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Carat Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondCaratEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <CaratBasicsSection />
          <SizeComparisonSection />
          <PriceJumpSection />
          <ExpertTipsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
