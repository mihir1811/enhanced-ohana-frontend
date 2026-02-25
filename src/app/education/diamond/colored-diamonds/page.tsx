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
          alt="Colored Diamonds Education" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1596495516964-8a1b1b5a0f2?auto=format&fit=crop&w=2000&q=80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary bg-white/90 rounded-full uppercase">
          Diamond Education
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Colored Diamonds
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to fancy colored diamonds: rare colors, grading, value, and what makes these gems so special.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Color Guide
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Rarity Chart
          </Button>
        </div>
      </div>
    </section>
  );
};

const ColorScaleSection = () => {
  const colors = [
    {
      name: "Red Diamonds",
      color: "#FF0000",
      rarity: "Extremely Rare",
      description: "Most valuable and rarest colored diamond",
      pricePerCarat: "$1,000,000+",
      famous: "Moussaieff Red"
    },
    {
      name: "Pink Diamonds",
      color: "#FFB6C1",
      rarity: "Very Rare",
      description: "Romantic and highly sought after",
      pricePerCarat: "$100,000-500,000",
      famous: "Pink Star"
    },
    {
      name: "Blue Diamonds",
      color: "#0000FF",
      rarity: "Very Rare",
      description: "Deep blue with exceptional brilliance",
      pricePerCarat: "$100,000-300,000",
      famous: "Hope Diamond"
    },
    {
      name: "Green Diamonds",
      color: "#00FF00",
      rarity: "Very Rare",
      description: "Natural green from radiation exposure",
      pricePerCarat: "$50,000-200,000",
      famous: "Dresden Green"
    },
    {
      name: "Yellow Diamonds",
      color: "#FFD700",
      rarity: "Rare",
      description: "Most common fancy color",
      pricePerCarat: "$20,000-100,000",
      famous: "Allnatt"
    },
    {
      name: "Orange Diamonds",
      color: "#FFA500",
      rarity: "Very Rare",
      description: "Vibrant orange with fire",
      pricePerCarat: "$100,000-300,000",
      famous: "Pumpkin Diamond"
    },
    {
      name: "Purple Diamonds",
      color: "#800080",
      rarity: "Extremely Rare",
      description: "Deep purple with mystical appeal",
      pricePerCarat: "$200,000-500,000",
      famous: "Purple Orchid"
    },
    {
      name: "Brown Diamonds",
      color: "#964B00",
      rarity: "Uncommon",
      description: "Champagne and cognac tones",
      pricePerCarat: "$5,000-25,000",
      famous: "Golden Jubilee"
    },
    {
      name: "Black Diamonds",
      color: "#000000",
      rarity: "Uncommon",
      description: "Natural black from graphite inclusions",
      pricePerCarat: "$2,000-10,000",
      famous: "Black Orlov"
    },
    {
      name: "Gray Diamonds",
      color: "#808080",
      rarity: "Rare",
      description: "Subtle gray with modern appeal",
      pricePerCarat: "$5,000-30,000",
      famous: "Gray Diamond"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Fancy Color Diamond Scale
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Colored diamonds are graded differently than white diamonds. Color intensity and rarity determine value.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {colors.map((color, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full border-2 border-slate-300 dark:border-slate-600 mb-3"
                    style={{ backgroundColor: color.color }}
                  >
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{color.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {color.description}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Rarity:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{color.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Price/Carat:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{color.pricePerCarat}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Famous:</strong> {color.famous}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const GradingSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Colored Diamond Grading
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Fancy colored diamonds use different grading system than white diamonds.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Color Intensity Scale</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 text-sm">F</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Faint</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Barely perceptible color. Lowest intensity grade.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 dark:text-orange-400 text-sm">L</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Light</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Subtle but noticeable color. Good value option.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm">F</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Fancy</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Clear, attractive color. Standard fancy grade.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 text-sm">I</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Intense</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Strong, vivid color. High value and rarity.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">V</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Vivid</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Exceptional color saturation. Highest grade and value.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Grading Factors</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Hue</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      The actual color (red, blue, pink, etc.). Pure hue increases value.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Tone</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lightness or darkness. Medium tones usually most valuable.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Saturation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Color intensity. Higher saturation means more vivid color and higher value.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Distribution</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      How evenly color is distributed. Even color is most valuable.
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

const ValueFactorsSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Makes Colored Diamonds Valuable
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Understanding value factors helps you make informed colored diamond purchases.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Rarity Factors</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Color Type</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Red, pink, and blue are rarest and most valuable
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Intensity</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Vivid and intense colors command premium prices
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Size</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Large colored diamonds are extremely rare and valuable
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Quality Factors</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Natural Color</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Naturally colored diamonds are more valuable than treated ones
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Clarity</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Eye-clean clarity is preferred but less critical than color
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Cut Quality</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Good cut enhances color and brilliance
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
        Discover Colored Diamonds
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of rare and beautiful colored diamonds with expert guidance.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Colored Diamonds
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Color Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function ColoredDiamondsEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <ColorScaleSection />
          <GradingSection />
          <ValueFactorsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
