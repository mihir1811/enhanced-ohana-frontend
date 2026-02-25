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
          alt="Diamond Cut Education" 
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
          Diamond Cut Quality
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Master diamond cut quality - the most important factor affecting brilliance, fire, and overall beauty of your diamond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Cut Grades
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Light Performance
          </Button>
        </div>
      </div>
    </section>
  );
};

const CutGradesSection = () => {
  const grades = [
    {
      grade: "Excellent",
      description: "Maximum light performance. Reflects nearly all light that enters.",
      percentage: "95-99%",
      bestFor: "Engagement rings, special occasions",
      price: "Premium",
      lightPerformance: "Maximum brilliance and fire"
    },
    {
      grade: "Very Good",
      description: "Reflects most light that enters. Very slight loss of brilliance.",
      percentage: "90-94%",
      bestFor: "Engagement rings, fine jewelry",
      price: "High",
      lightPerformance: "Excellent sparkle"
    },
    {
      grade: "Good",
      description: "Reflects most light but not as much as higher grades.",
      percentage: "75-89%",
      bestFor: "Fashion jewelry, budget-conscious",
      price: "Moderate",
      lightPerformance: "Good sparkle"
    },
    {
      grade: "Fair",
      description: "Noticeable loss of light performance.",
      percentage: "60-74%",
      bestFor: "Small diamonds, accent stones",
      price: "Budget",
      lightPerformance: "Limited sparkle"
    },
    {
      grade: "Poor",
      description: "Significant light loss. Appears dull and lifeless.",
      percentage: "Below 60%",
      bestFor: "Not recommended for jewelry",
      price: "Lowest",
      lightPerformance: "Minimal sparkle"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Diamond Cut Grades
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Cut grade determines how well a diamond reflects light. Higher grades mean more brilliance and sparkle.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grades.map((grade, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${
              grade.grade === "Excellent" ? "ring-2 ring-green-500/20 border-green-500/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 ${
                    grade.grade === "Excellent" ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                    grade.grade === "Very Good" ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                    grade.grade === "Good" ? "bg-gradient-to-br from-yellow-500 to-orange-500" :
                    "bg-gradient-to-br from-gray-500 to-gray-600"
                  }`}>
                    {grade.grade}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{grade.grade}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {grade.description}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Light Return:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.percentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Best For:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.bestFor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Price:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grade.price}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Light Performance:</strong> {grade.lightPerformance}
                  </p>
                </div>
                
                {grade.grade === "Excellent" && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      BEST CHOICE
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

const LightPerformanceSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Light Performance
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            How diamond cut affects light behavior and creates the sparkle that makes diamonds so captivating.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Light Return</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Brilliance</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      White light reflected back to the eye. More brilliance means more sparkle.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Fire</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Colored light dispersion that creates rainbow effects. More fire means more color play.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Scintillation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Sparkle patterns when diamond moves. More scintillation means more dynamic sparkle.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Cut Factors</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Proportions</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Ratio of crown, pavilion, and table. Perfect proportions maximize light return.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Symmetry</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      How well facets align. Perfect symmetry ensures even light distribution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Polish</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Surface smoothness. Better polish reduces light loss and enhances sparkle.
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

const ExpertTipsSection = () => {
  const tips = [
    {
      title: "Cut is Most Important",
      description: "Cut affects diamond beauty more than color, clarity, or carat. Prioritize cut grade for maximum sparkle.",
      icon: "💎"
    },
    {
      title: "Excellent vs Very Good",
      description: "Most people can't tell the difference between Excellent and Very Good cuts, but price difference can be significant.",
      icon: "💰"
    },
    {
      title: "Shape Affects Cut",
      description: "Some shapes (emerald, asscher) show cut quality more than others (round, princess).",
      icon: "🔷"
    },
    {
      title: "Lighting Matters",
      description: "View diamonds in different lighting conditions to see true cut quality and light performance.",
      icon: "💡"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Expert Cut Tips
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Professional advice for choosing the perfect diamond cut grade.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((tip, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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
        Find Your Perfect Cut
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use your cut knowledge to select diamonds with maximum brilliance and sparkle for your budget.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Search by Cut Grade
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Cut Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondCutEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <CutGradesSection />
          <LightPerformanceSection />
          <ExpertTipsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
