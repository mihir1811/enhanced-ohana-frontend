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
          alt="Lab-Grown vs Moissanite Education" 
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
          Lab-Grown Diamonds vs Moissanite
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete comparison: lab-grown diamonds vs moissanite. Understand the differences, properties, and value.
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
      category: "Chemical Composition",
      labGrown: "Carbon (C)",
      moissanite: "Silicon Carbide (SiC)",
      difference: "Different chemical elements",
      impact: "Different physical properties"
    },
    {
      category: "Hardness",
      labGrown: "10 on Mohs scale",
      moissanite: "9.25 on Mohs scale",
      difference: "Lab-grown slightly harder",
      impact: "Better scratch resistance"
    },
    {
      category: "Brilliance & Fire",
      labGrown: "Excellent brilliance, good fire",
      moissanite: "Exceptional brilliance, 2.4x more fire",
      difference: "Moissanite shows more colorful sparkle",
      impact: "Moissanite more colorful, lab-grown more traditional"
    },
    {
      category: "Refractive Index",
      labGrown: "2.42",
      moissanite: "2.65",
      difference: "Moissanite bends light more",
      impact: "Moissanite appears more brilliant"
    },
    {
      category: "Density",
      labGrown: "3.51 g/cm³",
      moissanite: "3.22 g/cm³",
      difference: "Lab-grown slightly denser",
      impact: "Similar size, slightly different weight"
    },
    {
      category: "Price",
      labGrown: "$3,000-8,000 per carat",
      moissanite: "$500-1,500 per carat",
      difference: "Lab-grown 6x more expensive",
      impact: "Moissanite much more affordable"
    },
    {
      category: "Durability",
      labGrown: "Excellent durability",
      moissanite: "Good durability, can chip",
      difference: "Lab-grown more durable",
      impact: "Better for daily wear"
    },
    {
      category: "Color Range",
      labGrown: "D-Z color scale",
      moissanite: "Near colorless to faint yellow",
      difference: "Lab-grown wider color options",
      impact: "More choice in lab-grown"
    },
    {
      category: "Market Acceptance",
      labGrown: "Growing acceptance",
      moissanite: "Niche market",
      difference: "Lab-grown more mainstream",
      impact: "Lab-grown better resale value"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Property Comparison
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Scientific comparison of key properties between lab-grown diamonds and moissanite.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Property
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Lab-Grown Diamonds
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Moissanite
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  Key Difference
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
                    {row.moissanite}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.difference}
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

const VisualComparisonSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Visual & Performance Comparison
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            How lab-grown diamonds and moissanite differ in appearance and performance characteristics.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Appearance Differences</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">💎</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Traditional Diamond Look</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lab-grown diamonds have classic diamond appearance with traditional brilliance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-sm">✨</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Colorful Sparkle</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Moissanite shows 2.4x more fire and spectral colors
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Performance Characteristics</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Clarity</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lab-grown diamonds can achieve flawless clarity, moissanite may show inclusions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">⚖️</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Durability</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lab-grown diamonds are harder and more scratch-resistant
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
            Expert guidance for choosing between lab-grown diamonds and moissanite based on your priorities.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Choose Lab-Grown If:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Traditional Diamond Experience</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want authentic diamond look and feel with modern benefits
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Investment Value</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Better long-term value and resale potential
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Durability Priority</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Need harder stone for daily wear and active lifestyle
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Choose Moissanite If:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Budget Priority</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want maximum sparkle and size at lowest price
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Colorful Brilliance</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want exceptional fire and rainbow light effects
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-slate-900 dark:text-white">Fashion Statement</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Want unique, colorful alternative to traditional diamonds
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
        Choose Your Perfect Stone
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Compare lab-grown diamonds and moissanite to find the perfect choice for your style and budget.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Compare Side by Side
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Expert Consultation
        </Button>
      </div>
    </div>
  </section>
);

export default function LabGrownVsMoissaniteEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <ComparisonTableSection />
          <VisualComparisonSection />
          <ChoosingSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
