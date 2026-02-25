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
          alt="Diamond Clarity Education" 
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
          Diamond Clarity Scale
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to diamond clarity from flawless to included. Learn how natural characteristics affect beauty and value.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Clarity Grades
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Inclusion Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const ClarityScaleSection = () => {
  const clarityGrades = [
    {
      grade: "FL",
      description: "Flawless",
      details: "No inclusions or blemishes visible under 10x magnification",
      visibility: "None",
      rarity: "Extremely Rare",
      value: "Highest",
      bestFor: "Investment, perfection"
    },
    {
      grade: "IF",
      description: "Internally Flawless",
      details: "No inclusions visible under 10x magnification, only minor surface blemishes",
      visibility: "None",
      rarity: "Very Rare",
      value: "Very High",
      bestFor: "High-end jewelry"
    },
    {
      grade: "VVS1",
      description: "Very Very Slightly Included 1",
      details: "Minute inclusions extremely difficult to see under 10x magnification",
      visibility: "Expert only",
      rarity: "Rare",
      value: "Very High",
      bestFor: "Fine jewelry"
    },
    {
      grade: "VVS2",
      description: "Very Very Slightly Included 2",
      details: "Minute inclusions very difficult to see under 10x magnification",
      visibility: "Expert only",
      rarity: "Rare",
      value: "Very High",
      bestFor: "Fine jewelry"
    },
    {
      grade: "VS1",
      description: "Very Slightly Included 1",
      details: "Minor inclusions difficult to see under 10x magnification",
      visibility: "Expert only",
      rarity: "Uncommon",
      value: "High",
      bestFor: "Engagement rings"
    },
    {
      grade: "VS2",
      description: "Very Slightly Included 2",
      details: "Minor inclusions somewhat easy to see under 10x magnification",
      visibility: "Expert only",
      rarity: "Common",
      value: "High",
      bestFor: "Engagement rings"
    },
    {
      grade: "SI1",
      description: "Slightly Included 1",
      details: "Noticeable inclusions easy to see under 10x magnification",
      visibility: "Eye-clean usually",
      rarity: "Common",
      value: "Good",
      bestFor: "Best value"
    },
    {
      grade: "SI2",
      description: "Slightly Included 2",
      details: "Noticeable inclusions easy to see under 10x magnification",
      visibility: "May be visible",
      rarity: "Common",
      value: "Good",
      bestFor: "Budget conscious"
    },
    {
      grade: "I1",
      description: "Included 1",
      details: "Obvious inclusions visible to naked eye",
      visibility: "Visible",
      rarity: "Common",
      value: "Fair",
      bestFor: "Not recommended"
    },
    {
      grade: "I2",
      description: "Included 2",
      details: "Prominent inclusions easily visible to naked eye",
      visibility: "Very visible",
      rarity: "Common",
      value: "Low",
      bestFor: "Not recommended"
    },
    {
      grade: "I3",
      description: "Included 3",
      details: "Very prominent inclusions affecting durability and transparency",
      visibility: "Very visible",
      rarity: "Common",
      value: "Lowest",
      bestFor: "Not recommended"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Diamond Clarity Scale
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            The GIA clarity scale ranges from Flawless (FL) to Included (I3). Fewer inclusions means higher value.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clarityGrades.map((grade, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all duration-300 ${
              grade.grade === "SI1" ? "ring-2 ring-green-500/20 border-green-500/30" : ""
            }`}>
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 ${
                    grade.grade === "FL" || grade.grade === "IF" ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                    grade.grade.startsWith("VVS") ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                    grade.grade.startsWith("VS") ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                    grade.grade.startsWith("SI") ? "bg-gradient-to-br from-yellow-500 to-orange-500" :
                    "bg-gradient-to-br from-red-500 to-orange-500"
                  }`}>
                    {grade.grade}
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{grade.description}</h3>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {grade.details}
                </p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Visibility:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.visibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Rarity:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Value:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.value}</span>
                  </div>
                </div>
                
                {grade.grade === "SI1" && (
                  <div className="mt-2 text-center">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      BEST VALUE
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

const InclusionTypesSection = () => {
  const inclusions = [
    {
      name: "Crystals",
      description: "Mineral crystals trapped inside diamond during formation",
      appearance: "Small dots or specks",
      impact: "Minor to moderate",
      common: "Very common"
    },
    {
      name: "Feathers",
      description: "Internal fractures or breaks in diamond structure",
      appearance: "Feather-like patterns",
      impact: "Minor to severe",
      common: "Common"
    },
    {
      name: "Clouds",
      description: "Group of tiny crystals creating hazy appearance",
      appearance: "Cloudy areas",
      impact: "Minor to moderate",
      common: "Common"
    },
    {
      name: "Needles",
      description: "Long, thin crystal inclusions",
      appearance: "Thin lines or needles",
      impact: "Minor",
      common: "Common"
    },
    {
      name: "Knots",
      description: "Crystal reaching diamond surface",
      appearance: "Raised surface areas",
      impact: "Moderate to severe",
      common: "Uncommon"
    },
    {
      name: "Cavities",
      description: "Holes or indentations in diamond",
      appearance: "Small holes",
      impact: "Moderate",
      common: "Uncommon"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Types of Inclusions
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Understanding different types of inclusions helps you evaluate diamond clarity and value.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inclusions.map((inclusion, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{inclusion.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {inclusion.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Appearance:</span>
                      <span className="text-slate-600 dark:text-slate-400"> {inclusion.appearance}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Impact:</span>
                      <span className="text-slate-600 dark:text-slate-400"> {inclusion.impact}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Common:</span>
                      <span className="text-slate-600 dark:text-slate-400"> {inclusion.common}</span>
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

const EyeCleanSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding "Eye-Clean"
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            "Eye-clean" means inclusions are not visible to the naked eye. This is more important than the technical grade.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-green-50 dark:bg-green-950 p-8 rounded-xl border border-green-200 dark:border-green-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Eye-Clean Grades</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">FL</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Flawless</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Perfectly eye-clean</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">IF</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Internally Flawless</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Perfectly eye-clean</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">VVS</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Very Very Slight</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Always eye-clean</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">VS</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Very Slight</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Always eye-clean</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">SI1</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Slight Included 1</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Usually eye-clean</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 dark:bg-amber-950 p-8 rounded-xl border border-amber-200 dark:border-amber-800">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">May Show Inclusions</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">SI2</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Slight Included 2</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">May show inclusions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">I1</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Included 1</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Visible inclusions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">I2</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Included 2</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Very visible</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">I3</div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Included 3</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Very visible</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            <strong>💡 Expert Tip:</strong> SI1 diamonds offer the best value - they're usually eye-clean but cost significantly less than VS grades. Always ask if the diamond is eye-clean when buying SI grades.
          </p>
        </div>
      </div>
    </section>
  );
};

const ExpertTipsSection = () => {
  const tips = [
    {
      title: "SI1 is Sweet Spot",
      description: "SI1 diamonds are usually eye-clean but cost 20-30% less than VS grades. Best value for most buyers.",
      icon: "💎"
    },
    {
      title: "Don't Overpay for Perfection",
      description: "FL and IF grades are extremely expensive. VS1-VS2 look identical to naked eye at much lower cost.",
      icon: "💰"
    },
    {
      title: "Consider Diamond Size",
      description: "Inclusions are more visible in larger diamonds. Higher clarity may be more important for larger stones.",
      icon: "📏"
    },
    {
      title: "Setting Can Hide Inclusions",
      description: "Prong settings can hide small inclusions better than bezel settings.",
      icon: "🔗"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Expert Clarity Tips
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Professional advice for choosing the perfect diamond clarity grade.
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
        Find Your Perfect Clarity
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use your clarity knowledge to select diamonds with the perfect balance of beauty and value.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Search by Clarity Grade
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Clarity Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondClarityEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <ClarityScaleSection />
          <InclusionTypesSection />
          <EyeCleanSection />
          <ExpertTipsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
