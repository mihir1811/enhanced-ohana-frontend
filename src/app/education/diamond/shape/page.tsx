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
          alt="Diamond Shapes Education" 
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
          Diamond Shapes Guide
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to diamond shapes: popular cuts, characteristics, and how shape affects beauty and value.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Shape Gallery
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Shape Comparison
          </Button>
        </div>
      </div>
    </section>
  );
};

const PopularShapesSection = () => {
  const shapes = [
    {
      name: "Round Brilliant",
      description: "Classic 58-facet cut with maximum sparkle and fire",
      popularity: "75% of diamonds",
      bestFor: "Engagement rings, timeless elegance",
      characteristics: ["Maximum brilliance", "Excellent fire", "Timeless appeal", "Hides color well"],
      priceFactor: "Baseline (100%)"
    },
    {
      name: "Princess",
      description: "Square shape with brilliant faceting for modern sparkle",
      popularity: "8% of diamonds",
      bestFor: "Modern engagement rings, contemporary settings",
      characteristics: ["Modern look", "Good brilliance", "Sharp corners", "Efficient cutting"],
      priceFactor: "80-90%"
    },
    {
      name: "Cushion",
      description: "Pillow-like shape with rounded corners and large facets",
      popularity: "5% of diamonds",
      bestFor: "Vintage settings, romantic appeal",
      characteristics: ["Romantic look", "Large facets", "Good brilliance", "Vintage charm"],
      priceFactor: "85-95%"
    },
    {
      name: "Oval",
      description: "Elongated brilliant cut for elegant finger appearance",
      popularity: "6% of diamonds",
      bestFor: "Elongating fingers, unique engagement rings",
      characteristics: ["Finger-lengthening", "Brilliant sparkle", "Elegant look", "Modern appeal"],
      priceFactor: "90-100%"
    },
    {
      name: "Emerald",
      description: "Rectangular step-cut with dramatic hall-of-mirrors effect",
      popularity: "3% of diamonds",
      bestFor: "Art deco settings, sophisticated look",
      characteristics: ["Artistic appeal", "Hall-of-mirrors", "Clarity emphasis", "Elegant lines"],
      priceFactor: "70-80%"
    },
    {
      name: "Radiant",
      description: "Rectangle with trimmed corners and brilliant faceting",
      popularity: "2% of diamonds",
      bestFor: "Modern settings, brilliant rectangle shape",
      characteristics: ["Brilliant sparkle", "Modern look", "Efficient cutting", "Unique appearance"],
      priceFactor: "85-95%"
    },
    {
      name: "Asscher",
      description: "Square step-cut with dramatic depth and clarity",
      popularity: "1% of diamonds",
      bestFor: "Art deco settings, vintage elegance",
      characteristics: ["Dramatic depth", "Clarity focus", "Art deco style", "Unique appeal"],
      priceFactor: "75-85%"
    },
    {
      name: "Marquise",
      description: "Navel-shaped brilliant cut for maximum carat appearance",
      popularity: "1% of diamonds",
      bestFor: "Elongating fingers, vintage settings",
      characteristics: ["Carat appearance", "Elegant look", "Brilliant sparkle", "Unique shape"],
      priceFactor: "90-100%"
    },
    {
      name: "Pear",
      description: "Teardrop shape combining round and marquise elements",
      popularity: "1% of diamonds",
      bestFor: "Unique engagement rings, elegant pendants",
      characteristics: ["Elegant droplet", "Brilliant sparkle", "Unique look", "Versatile setting"],
      priceFactor: "85-95%"
    },
    {
      name: "Heart",
      description: "Romantic heart shape with brilliant faceting",
      popularity: "0.5% of diamonds",
      bestFor: "Romantic jewelry, anniversary gifts",
      characteristics: ["Romantic symbol", "Brilliant sparkle", "Unique appeal", "Emotional value"],
      priceFactor: "90-100%"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Popular Diamond Shapes
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Explore the most popular diamond shapes, their unique characteristics, and what makes each special.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shapes.map((shape, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${
              shape.name === "Round Brilliant" ? "ring-2 ring-blue-500/20 border-blue-500/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{shape.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {shape.description}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Popularity:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{shape.popularity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Price Factor:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{shape.priceFactor}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <strong>Best For:</strong> {shape.bestFor}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {shape.characteristics.slice(0, 3).map((char, charIndex) => (
                      <span key={charIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                
                {shape.name === "Round Brilliant" && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ShapeComparisonSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Shape Characteristics Comparison
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Understanding how different shapes affect diamond appearance, brilliance, and value.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Brilliant Cuts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">✨</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Maximum Sparkle</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Round, Princess, Oval, Marquise, Pear, Heart, Radiant, Cushion
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">💎</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Light Performance</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Excellent brilliance and fire with many facets for light reflection
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Best Value</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Efficient use of rough diamond, good price-to-carat ratio
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Step Cuts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">🔷</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Elegant Appearance</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Emerald, Asscher, Baguette with clean, geometric lines
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">🏛️️</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Clarity Emphasis</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Large facets showcase diamond clarity and internal characteristics
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">🎨</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Color Consideration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Step cuts show color more, may require higher color grades
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

const ChoosingSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How to Choose Diamond Shape
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Expert guidance for selecting the perfect diamond shape for your style and budget.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Personal Style</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Classic & Timeless</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Round brilliant for traditional elegance and universal appeal
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Modern & Unique</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Princess, Radiant, or Asscher for contemporary style
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Romantic & Elegant</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Heart, Pear, or Cushion for romantic, feminine appeal
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Practical Considerations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Hand Size & Shape</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Oval and Marquise elongate fingers, Round suits all sizes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Setting Compatibility</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Consider prong vs bezel settings for different shapes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Budget & Value</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Fancy shapes offer 10-30% better value than round brilliants
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

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
        Find Your Perfect Shape
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of diamonds in all shapes with expert guidance for your perfect choice.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse by Shape
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Shape Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondShapesEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <PopularShapesSection />
          <ShapeComparisonSection />
          <ChoosingSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
