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
          alt="Flawless Diamonds Education" 
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
          Flawless Diamonds
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to flawless diamonds (FL-IF): ultimate clarity, extreme rarity, and investment value.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            FL-IF Grades
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Investment Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const FlawlessGradesSection = () => {
  const grades = [
    {
      grade: "FL",
      description: "Flawless",
      details: "No internal inclusions or external blemishes visible under 10x magnification",
      visibility: "None visible",
      rarity: "Less than 0.1% of diamonds",
      pricePremium: "300-500% above average",
      bestFor: "Investment, perfection seekers",
      characteristics: ["Perfect clarity", "Maximum brilliance", "Investment grade", "Extreme rarity"]
    },
    {
      grade: "IF",
      description: "Internally Flawless",
      details: "No internal inclusions visible under 10x magnification, only minor surface blemishes",
      visibility: "None visible internally",
      rarity: "Less than 0.5% of diamonds",
      pricePremium: "200-300% above average",
      bestFor: "High-end jewelry, collectors",
      characteristics: ["Internally perfect", "Minor surface marks", "High brilliance", "Very rare"]
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Flawless Diamond Grades
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            FL (Flawless) and IF (Internally Flawless) represent the pinnacle of diamond clarity - perfect stones with no visible imperfections.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {grades.map((grade, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
                    {grade.grade}
                  </div>
                  <h3 className="font-bold text-2xl mb-2 text-slate-900 dark:text-white">{grade.description}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {grade.details}
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Visibility:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.visibility}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Rarity:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.rarity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Price Premium:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.pricePremium}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <strong>Best For:</strong> {grade.bestFor}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {grade.characteristics.map((char, charIndex) => (
                      <span key={charIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                        {char}
                      </span>
                    ))}
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

const RaritySection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Flawless Rarity
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Flawless diamonds are among the rarest gemstones on Earth, making them highly valuable and sought after.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Statistical Rarity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 text-sm">0.1%</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">FL Diamonds</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Only 1 in 1,000 diamonds achieves flawless grade
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 dark:text-orange-400 text-sm">0.5%</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">IF Diamonds</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Only 1 in 200 diamonds achieves internally flawless grade
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm">20+</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Years to Find</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Major miners may work 20+ years to find one flawless diamond
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Market Impact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">💰</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Price Premium</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Flawless diamonds command 300-500% premium over VS clarity diamonds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">📈</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Investment Value</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Historically appreciate faster than other clarity grades
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Collector Demand</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      High demand from collectors and investors worldwide
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

const InvestmentSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Flawless Diamonds as Investment
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Flawless diamonds are considered excellent investments due to their rarity and enduring value.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Investment Advantages</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Rarity Value</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Extreme scarcity ensures long-term value appreciation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Global Demand</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Strong international market for investment-grade diamonds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Portable Wealth</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Compact, high-value, easily stored and transported
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Investment Considerations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">!</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Certification Essential</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      GIA or IGI certification required for investment value
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">!</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Market Knowledge</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Requires understanding of diamond market trends
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">!</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Insurance Important</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Proper insurance essential for high-value investments
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
        Discover Flawless Diamonds
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of investment-grade flawless diamonds with complete certification and expert guidance.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Flawless Diamonds
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Investment Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function FlawlessDiamondsEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <FlawlessGradesSection />
          <RaritySection />
          <InvestmentSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
