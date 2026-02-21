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
          alt="Flawless Lab-Grown Diamonds Education" 
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
          Flawless Lab-Grown Diamonds
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to flawless lab-grown diamonds: perfect clarity, advanced technology, and exceptional value.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Lab-Grown FL-IF
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Technology Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const TechnologySection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Lab-Grown Diamond Technology
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Advanced technology creates perfect diamonds with identical chemical and physical properties to natural diamonds.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-blue-50 dark:bg-blue-950 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">HPHT Process</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">HPHT</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">High Pressure High Temperature</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Replicates natural diamond formation conditions with 5-6 GPa pressure and 1,300-1,600°C temperature
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">⚡</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Growth Speed</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Creates diamonds in days to weeks, much faster than natural formation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔬</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Metal Catalyst</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Uses metal solvent (Fe, Ni, Co) to dissolve and recrystallize carbon
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950 p-8 rounded-xl border border-green-200 dark:border-green-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">CVD Process</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">CVD</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Chemical Vapor Deposition</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Builds diamond layer by layer from carbon-rich gas at 800-1,200°C
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔬</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Layer Growth</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Creates diamond by depositing carbon atoms layer by layer
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🎯</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Precision Control</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Allows precise control over diamond properties and characteristics
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

const FlawlessComparisonSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Lab-Grown vs Natural Flawless
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Compare flawless lab-grown diamonds with natural flawless diamonds to understand key differences and advantages.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Lab-Grown Flawless</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Consistent Quality</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Technology ensures consistent flawless quality and predictable results
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Price Advantage</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      30-70% less expensive than natural flawless diamonds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Availability</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Readily available in larger sizes and various shapes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Natural Flawless</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Ancient Formation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Formed over billions of years deep within Earth's mantle
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Extreme Rarity</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Less than 0.1% of natural diamonds achieve flawless grade
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">💰</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Premium Price</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      300-500% premium over other clarity grades
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

const ValueSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Value Proposition
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Lab-grown flawless diamonds offer exceptional value with identical beauty to natural diamonds.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Lab-Grown Advantages</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Price Efficiency</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Same flawless quality at 30-70% lower cost
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Ethical Choice</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Conflict-free with transparent sourcing and production
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Custom Options</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Can be grown to specific sizes, shapes, and colors
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Market Position</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">📊</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Growing Market</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Rapidly growing acceptance in fine jewelry market
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">📜</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Certification</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Same GIA/IGI certification standards as natural diamonds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">💎</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Identical Properties</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Same hardness, brilliance, and fire as natural diamonds
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
        Discover Flawless Lab-Grown Diamonds
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of perfect lab-grown diamonds with exceptional clarity and unbeatable value.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Lab-Grown FL-IF
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Lab-Grown Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function FlawlessLabGrownDiamondsEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <TechnologySection />
          <FlawlessComparisonSection />
          <ValueSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
