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
          alt="Diamond Education" 
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
          Master Diamond Quality
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to understanding diamonds: the 4Cs, grading, certification, and selection tips for confident purchasing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Explore 4Cs
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Diamond Search
          </Button>
        </div>
      </div>
    </section>
  );
};

const FourCsSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            The 4Cs of Diamonds
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            The universal language for diamond quality, established by GIA in the 1940s. Understanding these four characteristics helps you make informed decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Cut", desc: "How well diamond reflects light", icon: "✨", color: "from-blue-500 to-cyan-500" },
            { title: "Color", desc: "Absence of color in diamond", icon: "🎨", color: "from-purple-500 to-pink-500" },
            { title: "Clarity", desc: "Natural characteristics within", icon: "🔍", color: "from-green-500 to-emerald-500" },
            { title: "Carat", desc: "Diamond weight measurement", icon: "⚖️", color: "from-amber-500 to-orange-500" }
          ].map((c, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${c.color} rounded-full flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl font-bold">{c.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{c.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const QuickGuides = () => {
  const guides = [
    { title: "Diamond Color Grading", desc: "Complete D-Z color scale guide", href: "/education/diamond/color" },
    { title: "Diamond Cut Quality", desc: "Understanding cut grades and light performance", href: "/education/diamond/cut" },
    { title: "Clarity Scale", desc: "From flawless to included diamonds", href: "/education/diamond/clarity" },
    { title: "Carat Size Guide", desc: "Weight vs. visual size comparison", href: "/education/diamond/carat" },
    { title: "Diamond Shapes", desc: "Round, princess, emerald and more", href: "/education/diamond/shapes" },
    { title: "Certification Guide", desc: "GIA, IGI, and diamond reports", href: "/education/diamond/certification" }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Diamond Education Guides
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            In-depth guides covering every aspect of diamond quality and selection.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {guide.desc}
                </p>
                <Link href={guide.href}>
                  <Button variant="outline" className="w-full border-primary/20 hover:border-primary hover:bg-primary/5 text-slate-700 dark:text-slate-300 hover:text-primary group">
                    <span className="mr-2">Read Guide</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </Link>
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
        Find Your Perfect Diamond
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Use your diamond knowledge to search with confidence and find the perfect balance of quality and value.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Search Diamonds
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Diamond Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <FourCsSection />
          <QuickGuides />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
