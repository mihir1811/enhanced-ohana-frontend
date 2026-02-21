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
          alt="Diamond Color Education" 
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
          Diamond Color Grading
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to diamond color scale from D (colorless) to Z (light yellow). Learn how color affects beauty and value.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Color Scale
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Color Tips
          </Button>
        </div>
      </div>
    </section>
  );
};

const ColorScaleSection = () => {
  const colorGrades = [
    { grade: "D", description: "Colorless", color: "#ffffff", border: "border-gray-300", textColor: "text-gray-700", rarity: "Extremely Rare", value: "Highest" },
    { grade: "E", description: "Colorless", color: "#ffffff", border: "border-gray-300", textColor: "text-gray-700", rarity: "Very Rare", value: "Very High" },
    { grade: "F", description: "Colorless", color: "#ffffff", border: "border-gray-300", textColor: "text-gray-700", rarity: "Rare", value: "High" },
    { grade: "G", description: "Near Colorless", color: "#fafafa", border: "border-gray-300", textColor: "text-gray-700", rarity: "Uncommon", value: "High" },
    { grade: "H", description: "Near Colorless", color: "#f5f5f5", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Good" },
    { grade: "I", description: "Near Colorless", color: "#f0f0f0", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Good" },
    { grade: "J", description: "Near Colorless", color: "#ebebeb", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Fair" },
    { grade: "K", description: "Faint", color: "#e6e6e6", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Fair" },
    { grade: "L-M", description: "Faint", color: "#e1e1e1", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Low" },
    { grade: "N-O", description: "Very Light", color: "#dcdcdc", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Low" },
    { grade: "P-R", description: "Light", color: "#d7d7d7", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Low" },
    { grade: "S-Z", description: "Light", color: "#d2d2d2", border: "border-gray-300", textColor: "text-gray-700", rarity: "Common", value: "Lowest" }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Diamond Color Scale
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            The GIA color scale ranges from D (completely colorless) to Z (noticeably colored). Less color means higher value.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-100 via-gray-100 to-yellow-100 rounded-full"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pt-8">
              {colorGrades.map((grade, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${grade.color} ${grade.border} border-2 flex items-center justify-center`}>
                    <span className={`font-bold text-sm ${grade.textColor}`}>{grade.grade}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{grade.grade}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{grade.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs text-slate-400">Rarity:</span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{grade.rarity}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs text-slate-400">Value:</span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{grade.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ColorGroupsSection = () => {
  const groups = [
    {
      name: "Colorless (D-F)",
      description: "Completely colorless to the naked eye. Highest quality and most valuable.",
      grades: ["D", "E", "F"],
      bestFor: "Investment, perfection seekers",
      priceRange: "Premium",
      visibility: "No visible color"
    },
    {
      name: "Near Colorless (G-J)",
      description: "Color only visible when compared to higher grades. Excellent value.",
      grades: ["G", "H", "I", "J"],
      bestFor: "Engagement rings, best value",
      priceRange: "High to Moderate",
      visibility: "Slight tint in J grade"
    },
    {
      name: "Faint Color (K-M)",
      description: "Faint yellow or brown tint visible to naked eye.",
      grades: ["K", "L", "M"],
      bestFor: "Vintage styles, yellow gold",
      priceRange: "Moderate",
      visibility: "Noticeable color"
    },
    {
      name: "Very Light to Light (N-Z)",
      description: "Noticeable yellow or brown color. Not recommended for fine jewelry.",
      grades: ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      bestFor: "Colored diamond market",
      priceRange: "Low",
      visibility: "Very noticeable"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Color Groups & Recommendations
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Understanding color groups helps you choose the perfect balance of quality and value.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${
              group.name === "Near Colorless (G-J)" ? "ring-2 ring-green-500/20 border-green-500/30" : ""
            }`}>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">{group.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {group.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Grades:</span>
                    <div className="flex flex-wrap gap-1">
                      {group.grades.map((grade, gradeIndex) => (
                        <span key={gradeIndex} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Best For:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{group.bestFor}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Price Range:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{group.priceRange}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Color Visibility:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{group.visibility}</span>
                  </div>
                </div>
                
                {group.name === "Near Colorless (G-J)" && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
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

const SettingInfluenceSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How Setting Affects Color
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            The metal color of your setting can enhance or minimize the appearance of diamond color.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                Au
              </div>
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Yellow Gold</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Enhances warmer diamond colors (I-J-K). Makes lower color grades appear more natural.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Best for I-J-K grades</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Hides yellow tint</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Warm appearance</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg mb-4">
                Pt
              </div>
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">Platinum</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                White metal enhances colorlessness. Best for higher color grades (D-F-G-H).
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Best for D-F-G-H grades</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Enhances colorlessness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Cool appearance</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                W
              </div>
              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">White Gold</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Similar to platinum. Best for colorless to near-colorless diamonds (D-G).
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Best for D-G grades</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">White appearance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Affordable alternative</span>
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
      title: "G-H is Sweet Spot",
      description: "G and H grades offer excellent value. Color is nearly invisible to naked eye but price is significantly lower than D-F.",
      icon: "💎"
    },
    {
      title: "Consider Setting Metal",
      description: "Yellow gold can make I-J diamonds appear more natural, while white metals enhance D-F colorlessness.",
      icon: "🔗"
    },
    {
      title: "Shape Matters",
      description: "Some shapes (emerald, asscher) show color more than others (round, princess). Consider shape when choosing color.",
      icon: "🔷"
    },
    {
      title: "Compare Side by Side",
      description: "Color differences are often only visible when comparing diamonds directly, not when viewed individually.",
      icon: "👁️"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Expert Color Tips
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Professional advice for choosing the perfect diamond color grade.
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
        Find Your Perfect Color
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use your color knowledge to select diamonds with the perfect balance of beauty and value.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Search by Color Grade
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Color Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondColorEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <ColorScaleSection />
          <ColorGroupsSection />
          <SettingInfluenceSection />
          <ExpertTipsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
