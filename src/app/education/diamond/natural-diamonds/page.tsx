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
          alt="Natural Diamonds Education" 
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
          Natural Diamonds
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to natural diamonds: formation, characteristics, value, and what makes earth-mined diamonds special.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Formation Process
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Natural vs Lab
          </Button>
        </div>
      </div>
    </section>
  );
};

const FormationSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How Natural Diamonds Form
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Natural diamonds form deep within Earth's mantle over billions of years through extreme heat and pressure.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-blue-50 dark:bg-blue-950 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Formation Process</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Carbon Source</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Pure carbon buried 90-120 miles deep in Earth's mantle
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Extreme Conditions</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Temperatures of 2,000°F and pressure 725,000 psi
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Crystallization</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Carbon atoms arrange in crystal structure over 1-3 billion years
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Volcanic Transport</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Carried to surface by deep-source volcanic eruptions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950 p-8 rounded-xl border border-green-200 dark:border-green-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Mining Locations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🌍</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Major Sources</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Russia, Botswana, Canada, Australia, South Africa, Democratic Republic of Congo
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">⛏️</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Mining Methods</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Open-pit, underground, alluvial (riverbed), marine mining
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📊</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Production</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      142 million carats annually, 90% used for industrial purposes
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

const CharacteristicsSection = () => {
  const characteristics = [
    {
      title: "Unique Identity",
      description: "Each natural diamond has unique internal characteristics and inclusions, like a fingerprint",
      icon: "🔍",
      importance: "Authentication"
    },
    {
      title: "Natural Inclusions",
      description: "Natural minerals and fractures trapped during formation create unique patterns",
      icon: "💎",
      importance: "Identification"
    },
    {
      title: "Age",
      description: "Most natural diamonds are 1-3 billion years old, formed deep within Earth",
      icon: "⏰",
      importance: "Rarity"
    },
    {
      title: "Geographic Origin",
      description: "Diamonds can be traced to specific mines and geographic regions",
      icon: "🌍",
      importance: "Provenance"
    },
    {
      title: "Natural Color",
      description: "Colors come from trace elements and natural radiation exposure",
      icon: "🎨",
      importance: "Value"
    },
    {
      title: "Crystal Structure",
      description: "Perfect cubic crystal structure gives diamonds their exceptional hardness",
      icon: "🔷",
      importance: "Durability"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Natural Diamond Characteristics
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Natural diamonds have unique properties that distinguish them from synthetic alternatives.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {characteristics.map((char, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <span className="text-2xl">{char.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{char.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {char.description}
                    </p>
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {char.importance}
                      </span>
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

const ValueSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Natural Diamond Value Factors
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Understanding what makes natural diamonds valuable helps you make informed purchasing decisions.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-amber-50 dark:bg-amber-950 p-8 rounded-xl border border-amber-200 dark:border-amber-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Traditional 4Cs</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">💎</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Cut, Color, Clarity, Carat</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Traditional factors still apply, with color being especially important for fancy colored diamonds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📏</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Rarity Premium</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Natural scarcity adds significant value, especially for large, high-quality stones
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-950 p-8 rounded-xl border border-purple-200 dark:border-purple-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Natural Premium Factors</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🌍</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Geographic Origin</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Certain mines (like Argyle pink diamonds) command premium prices
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📜</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Certification</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      GIA, IGI certification adds value and ensures authenticity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📊</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Market Demand</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Investment-grade diamonds and rare colors have strong market demand
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
        Discover Natural Diamonds
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of authentic natural diamonds with complete certification and expert guidance.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Natural Diamonds
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Diamond Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function NaturalDiamondsEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <FormationSection />
          <CharacteristicsSection />
          <ValueSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
