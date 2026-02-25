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
          alt="Diamond Shape vs Price Education" 
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
          Diamond Shape vs Price
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to how diamond shapes affect price: value factors, cost efficiency, and smart buying decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Price Analysis
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Value Calculator
          </Button>
        </div>
      </div>
    </section>
  );
};

const PriceEfficiencySection = () => {
  const shapes = [
    {
      name: "Round Brilliant",
      efficiency: "100% (Baseline)",
      description: "Most efficient cutting, maximizes rough diamond usage",
      pricePerCarat: "Baseline price",
      valueScore: "Excellent",
      bestFor: "Maximum value and brilliance"
    },
    {
      name: "Princess",
      efficiency: "80-90%",
      description: "Good efficiency with modern square cutting",
      pricePerCarat: "80-90% of round",
      valueScore: "Very Good",
      bestFor: "Modern style with good value"
    },
    {
      name: "Cushion",
      efficiency: "85-95%",
      description: "Moderate efficiency with romantic appeal",
      pricePerCarat: "85-95% of round",
      valueScore: "Good",
      bestFor: "Balance of beauty and value"
    },
    {
      name: "Oval",
      efficiency: "90-100%",
      description: "High efficiency with finger-lengthening effect",
      pricePerCarat: "90-100% of round",
      valueScore: "Good",
      bestFor: "Elegant appearance with good value"
    },
    {
      name: "Emerald",
      efficiency: "60-70%",
      description: "Lower efficiency due to step cutting and waste",
      pricePerCarat: "70-80% of round",
      valueScore: "Fair",
      bestFor: "Elegant look but higher price per carat"
    },
    {
      name: "Asscher",
      efficiency: "65-75%",
      description: "Moderate efficiency with unique step-cut design",
      pricePerCarat: "75-85% of round",
      valueScore: "Fair",
      bestFor: "Artistic appeal with moderate efficiency"
    },
    {
      name: "Radiant",
      efficiency: "85-95%",
      description: "Good efficiency combining brilliant and rectangular",
      pricePerCarat: "85-95% of round",
      valueScore: "Good",
      bestFor: "Modern rectangle with good value"
    },
    {
      name: "Marquise",
      efficiency: "90-100%",
      description: "High efficiency with maximum carat appearance",
      pricePerCarat: "90-100% of round",
      valueScore: "Good",
      bestFor: "Maximum size appearance with good value"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Cutting Efficiency & Price Impact
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            How efficiently different shapes use the rough diamond directly impacts price per carat and overall value.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shapes.map((shape, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${
              shape.efficiency.includes("100%") ? "ring-2 ring-green-500/20 border-green-500/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 ${
                    shape.efficiency.includes("100%") ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                    shape.efficiency.includes("80-90%") ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                    shape.efficiency.includes("85-95%") ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                    "bg-gradient-to-br from-amber-500 to-orange-500"
                  }`}>
                    {shape.name}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full"
                      style={{ width: `${shape.efficiency.replace('%', '')}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {shape.efficiency}
                  </p>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {shape.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Price/Carat:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{shape.pricePerCarat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Value Score:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{shape.valueScore}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Best For:</strong> {shape.bestFor}
                  </p>
                </div>
                
                {shape.efficiency.includes("100%") && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      MOST EFFICIENT
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

const ValueFactorsSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Shape Value Factors Beyond Efficiency
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Multiple factors beyond cutting efficiency determine diamond shape value and market demand.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Market Demand</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📈</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Popularity Premium</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Round brilliant commands 20-30% premium due to highest demand
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🎯</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Trend Influence</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Popular shapes (currently oval, cushion) may command temporary premiums
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">⏰</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Seasonal Demand</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Certain shapes peak during wedding and engagement seasons
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Size & Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📏</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Size Illusion</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Oval, marquise, and pear appear larger than same carat round diamonds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">💎</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Face-Up Appearance</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Some shapes (emerald, asscher) show more diamond face-up for better appearance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔧</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Setting Complexity</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Fancy shapes often require more complex and expensive settings
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

const SmartBuyingSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Smart Shape Buying Strategies
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Expert strategies for maximizing value when choosing diamond shapes for your budget and preferences.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Value Optimization</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">💡</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Fancy Shape Savings</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Non-round shapes offer 10-30% better value than round brilliants
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">💡</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Efficiency Priority</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Prioritize cutting efficiency for maximum diamond utilization
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">💡</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Size vs Shape</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Choose elongated shapes for larger appearance without increasing carat weight
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Budget Allocation</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">💰</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Shape vs 4Cs Balance</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Consider better shape with slightly lower color/clarity for same budget
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">💰</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Long-Term Value</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Classic shapes (round, princess) maintain better resale value
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">💰</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Market Timing</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Buy during off-peak seasons for better prices on popular shapes
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
        Maximize Diamond Value
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use shape knowledge to find the perfect balance of beauty, efficiency, and value for your budget.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Shape Value Calculator
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Shape Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondShapeVsPriceEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <PriceEfficiencySection />
          <ValueFactorsSection />
          <SmartBuyingSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
