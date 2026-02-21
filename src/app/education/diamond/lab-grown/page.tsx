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
          alt="Lab-Grown Diamonds Education" 
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
          Lab-Grown Diamonds
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to lab-grown diamonds: technology, benefits, comparison with natural diamonds, and value analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Technology Guide
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Lab vs Natural
          </Button>
        </div>
      </div>
    </section>
  );
};

const TechnologySection = () => {
  const technologies = [
    {
      name: "HPHT",
      fullName: "High Pressure High Temperature",
      description: "Replicates natural diamond formation conditions",
      process: "5-6 GPa pressure, 1,300-1,600°C temperature",
      time: "Days to weeks",
      advantages: ["Fast growth", "Large sizes", "Established technology"],
      bestFor: "Colorless and near-colorless diamonds"
    },
    {
      name: "CVD",
      fullName: "Chemical Vapor Deposition",
      description: "Builds diamond layer by layer from carbon gas",
      process: "Carbon-rich gas at 800-1,200°C",
      time: "Weeks to months",
      advantages: ["Precise control", "Custom properties", "High purity"],
      bestFor: "Large fancy colored diamonds"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Lab-Grown Diamond Technology
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Advanced technology creates diamonds with identical chemical and physical properties to natural diamonds.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {technologies.map((tech, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                    {tech.name}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{tech.fullName}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {tech.description}
                  </p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">🔬</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Process</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {tech.process}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 dark:text-green-400 text-sm">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Growth Time</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {tech.time}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-slate-900 dark:text-white">Key Advantages:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tech.advantages.map((advantage, advIndex) => (
                      <span key={advIndex} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {advantage}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Best For:</strong> {tech.bestFor}
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

const ComparisonSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Lab-Grown vs Natural Diamonds
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Side-by-side comparison of lab-grown and natural diamonds to help you make informed decisions.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Lab-Grown Diamonds</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Identical Properties</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Same chemical composition, crystal structure, hardness (10 on Mohs scale)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Price Advantage</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      30-70% less expensive than natural diamonds of same quality
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Ethical Choice</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Conflict-free, sustainable, and environmentally friendly
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
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
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Natural Diamonds</h3>
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
                      High-quality natural diamonds are increasingly rare and valuable
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">💰</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Investment Value</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Historically appreciates and maintains strong market demand
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

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Lab-Grown Diamonds
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Discover the compelling advantages that make lab-grown diamonds an excellent choice for modern buyers.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Financial Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">💰</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Cost Savings</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      30-70% less expensive for identical quality and appearance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">💰</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Better Value</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Larger, higher quality diamonds for same budget
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">💰</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Price Predictability</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      More stable pricing with less market volatility
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Ethical Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">🌱</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Conflict-Free</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Guaranteed conflict-free with transparent sourcing
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">🌱</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Sustainable</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Environmentally friendly production with lower carbon footprint
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">🌱</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Transparent Supply</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Full traceability from lab to consumer
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
        Discover Lab-Grown Diamonds
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of brilliant lab-grown diamonds with exceptional quality and unbeatable value.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Lab-Grown Diamonds
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Lab-Grown Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function LabGrownDiamondsEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <TechnologySection />
          <ComparisonSection />
          <BenefitsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
