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
          alt="Lab-Grown vs Natural Diamonds Education" 
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
          Lab-Grown vs Natural Diamonds
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Comprehensive comparison: lab-grown vs natural diamonds. Understand the differences, benefits, and make the right choice.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Compare Now
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Expert Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

const ComparisonTableSection = () => {
  const comparisonData = [
    {
      category: "Chemical & Physical",
      labGrown: "Identical to natural diamonds",
      natural: "Formed over billions of years",
      winner: "Tie (Identical)",
      importance: "No difference in appearance"
    },
    {
      category: "Origin",
      labGrown: "Created in laboratory",
      natural: "Mined from Earth's mantle",
      winner: "Depends on preference",
      importance: "Source and ethics consideration"
    },
    {
      category: "Environmental Impact",
      labGrown: "Sustainable, low carbon footprint",
      natural: "Significant environmental impact",
      winner: "Lab-Grown",
      importance: "Environmental sustainability"
    },
    {
      category: "Price",
      labGrown: "30-70% less expensive",
      natural: "Premium pricing",
      winner: "Lab-Grown",
      importance: "Cost savings"
    },
    {
      category: "Availability",
      labGrown: "Readily available in all sizes",
      natural: "Limited by rarity",
      winner: "Lab-Grown",
      importance: "Supply and choice"
    },
    {
      category: "Resale Value",
      labGrown: "Stable but lower resale",
      natural: "Strong investment potential",
      winner: "Natural",
      importance: "Investment consideration"
    },
    {
      category: "Certification",
      labGrown: "Same grading standards",
      natural: "Same grading standards",
      winner: "Tie (Equal)",
      importance: "Quality assurance"
    },
    {
      category: "Market Acceptance",
      labGrown: "Growing rapidly",
      natural: "Traditional preference",
      winner: "Natural",
      importance: "Market trends"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Head-to-Head Comparison
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Complete comparison between lab-grown and natural diamonds across all important factors.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Lab-Grown Diamonds
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Natural Diamonds
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {row.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.labGrown}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.natural}
                  </td>
                  <td className={`px-6 py-4 text-center text-sm font-bold ${
                    row.winner === "Lab-Grown" ? "text-green-600 dark:text-green-400" :
                    row.winner === "Natural" ? "text-amber-600 dark:text-amber-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>
                    {row.winner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const DetailedComparisonSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Detailed Analysis
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            In-depth analysis of key differences to help you make the perfect choice.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Lab-Grown Advantages</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">💰</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Cost Efficiency</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      30-70% less expensive for identical quality and appearance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">🌱</span>
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
                    <span className="text-green-600 dark:text-green-400 text-sm">📏</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Availability</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Readily available in all sizes, shapes, and colors
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Natural Diamond Advantages</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Investment Value</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Historically appreciates and maintains strong market demand
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Rarity Premium</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Natural scarcity adds significant value and prestige
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">📈</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Market Acceptance</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Traditional preference and established market position
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
            How to Choose
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Expert guidance for choosing between lab-grown and natural diamonds based on your priorities.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Choose Lab-Grown If:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Budget Priority</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want maximum size and quality within budget
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Ethical Concerns</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want conflict-free, sustainable, and transparent sourcing
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Large Size Priority</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want larger diamonds that are rare or expensive in natural form
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Choose Natural If:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Investment Priority</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want long-term value appreciation and investment potential
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Traditional Preference</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Value tradition, rarity, and natural origin story
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Resale Consideration</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Plan for future resale value and market acceptance
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
        Make Your Diamond Choice
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use our comprehensive comparison to choose the perfect diamond type for your needs and values.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Compare Diamonds Now
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Diamond Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function LabGrownVsNaturalDiamondsEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <ComparisonTableSection />
          <DetailedComparisonSection />
          <ChoosingSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
