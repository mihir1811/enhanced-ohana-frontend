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
          alt="Diamond Certification Education" 
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
          Diamond Certification
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Complete guide to diamond certification: GIA, IGI, AGS, and how certificates protect your investment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Certification Guide
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Verify Certificate
          </Button>
        </div>
      </div>
    </section>
  );
};

const CertificationLabsSection = () => {
  const labs = [
    {
      name: "GIA",
      fullName: "Gemological Institute of America",
      founded: "1931",
      reputation: "Gold Standard",
      description: "Most respected and widely recognized diamond grading laboratory",
      features: ["4Cs grading system", "Laser inscription", "Digital reports", "Global recognition"],
      reportTypes: ["Diamond Grading Report", "Diamond Dossier", "Colored Diamond Report"],
      website: "gia.edu"
    },
    {
      name: "IGI",
      fullName: "International Gemological Institute",
      founded: "1975",
      reputation: "International Standard",
      description: "Fast-growing global certification with modern technology",
      features: ["Advanced technology", "Quick turnaround", "Digital reports", "Lab-grown expertise"],
      reportTypes: ["Diamond Report", "Jewelry Report", "Colored Diamond Report"],
      website: "igi.org"
    },
    {
      name: "AGS",
      fullName: "American Gem Society",
      founded: "1934",
      reputation: "Technical Excellence",
      description: "Known for precise scientific grading and cut analysis",
      features: ["Cut grading system", "Performance analysis", "Scientific approach", "Detailed reports"],
      reportTypes: ["Diamond Quality Document", "Diamond Quality Report"],
      website: "americangemsociety.org"
    },
    {
      name: "GTL",
      fullName: "Gem Testing Laboratory",
      founded: "1995",
      reputation: "European Standard",
      description: "Leading European laboratory with strong technical expertise",
      features: ["European standards", "Advanced testing", "Detailed analysis", "Affordable pricing"],
      reportTypes: ["Diamond Certificate", "Colored Diamond Certificate"],
      website: "gtllab.com"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Major Certification Laboratories
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Leading diamond grading laboratories that provide trusted certification for natural and lab-grown diamonds.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {labs.map((lab, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${
              lab.name === "GIA" ? "ring-2 ring-yellow-500/20 border-yellow-500/30" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {lab.name}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{lab.fullName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span>Founded: {lab.founded}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        lab.reputation === "Gold Standard" ? "bg-yellow-100 text-yellow-700" :
                        lab.reputation === "International Standard" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {lab.reputation}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {lab.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-sm mb-2 text-slate-900 dark:text-white">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lab.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Report Types:</strong> {lab.reportTypes.join(", ")}
                  </p>
                </div>
                
                {lab.name === "GIA" && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                      MOST RECOGNIZED
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

const ReportAnalysisSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding Diamond Reports
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Learn to read and understand diamond certification reports for informed purchasing decisions.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Report Components</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4Cs</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">The 4Cs Grading</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Detailed assessment of Cut, Color, Clarity, and Carat weight with precise grades
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">📏</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Measurements</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Exact dimensions, proportions, and percentages for quality assessment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔍</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Inclusion Plot</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Diagram showing type, size, and location of all internal characteristics
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Security Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔢</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Report Number</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Unique identification number for online verification and database lookup
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔬</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Laser Inscription</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Micro-laser inscription on girdle with report number for identification
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">🔒</div>
                  <div>
                    <h4 className="font-medium mb-1 text-slate-900 dark:text-white">Security Features</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Watermarks, holograms, and QR codes for authenticity verification
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

const VerificationSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How to Verify Diamond Certificates
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Learn to verify diamond certificates online to ensure authenticity and match with physical diamond.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-all duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🌐</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Online Verification</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Enter report number on lab website to verify authenticity and view digital report
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 dark:text-green-400 text-xl">📱</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Mobile Apps</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Many labs offer mobile apps for quick certificate verification and storage
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 dark:text-purple-400 text-xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Jeweler Verification</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Reputable jewelers can verify certificates using professional equipment
              </p>
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
        Choose Certified Diamonds
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Explore our collection of certified diamonds with complete documentation and expert guidance.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse Certified Diamonds
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Certification Expert Chat
        </Button>
      </div>
    </div>
  </section>
);

export default function DiamondCertificationEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <CertificationLabsSection />
          <ReportAnalysisSection />
          <VerificationSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
