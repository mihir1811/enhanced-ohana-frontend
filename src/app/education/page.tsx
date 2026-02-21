"use client";

import NavigationUser from "@/components/Navigation/NavigationUser";
import Footer from "@/components/Footer";
import { SECTION_WIDTH } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 opacity-60">
        <img 
          alt="Jewelry Education" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1615655988625-3ba2b3e6e09a?auto=format&fit=crop&w=2000&q=80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary bg-white/90 rounded-full uppercase">
          Education Center
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Master Fine Jewelry
        </h1>
        <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
          Comprehensive guides to diamonds, gemstones, precious metals, and fine jewelry. Learn from experts and make informed decisions for your perfect piece.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/20">
            Start Learning
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
            Browse Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

const EducationCategories = () => {
  const categories = [
    {
      title: "Diamond Education",
      description: "Master the 4Cs, grading, and diamond selection",
      icon: "💎",
      topics: ["The 4Cs", "Color Grading", "Cut Quality", "Clarity Scale", "Carat Weight", "Diamond Shapes", "Certification"],
      href: "/education/diamond",
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      bgDark: "bg-blue-950"
    },
    {
      title: "Gemstone Education",
      description: "Explore colored gemstones, properties, and meanings",
      icon: "💍",
      topics: ["Birthstones", "Gemstone Types", "Color Properties", "Hardness Scale", "Care & Cleaning", "Investment Value"],
      href: "/education/gemstones",
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      bgDark: "bg-purple-950"
    },
    {
      title: "Jewelry Education",
      description: "Learn about jewelry types, styles, and craftsmanship",
      icon: "💍",
      topics: ["Ring Styles", "Necklace Types", "Earring Styles", "Bracelet Guide", "Setting Types", "Metal Choices"],
      href: "/education/jewelry",
      color: "from-green-500 to-emerald-500",
      bgLight: "bg-green-50",
      bgDark: "bg-green-950"
    },
    {
      title: "Metal Education",
      description: "Understand precious metals, properties, and care",
      icon: "🔗",
      topics: ["Gold Types", "Platinum Guide", "Silver Care", "Metal Properties", "Alloys", "Hallmarks"],
      href: "/education/metals",
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      bgDark: "bg-amber-950"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Complete Jewelry Education
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Expert guides covering every aspect of fine jewelry. From diamonds to gemstones, metals to craftsmanship - everything you need to know.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((category, index) => (
            <Card key={index} className={`group hover:shadow-2xl transition-all duration-300 ${category.bgLight} dark:${category.bgDark} border border-slate-200 dark:border-slate-800`}>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{category.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {category.topics.slice(0, 3).map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{topic}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={category.href}>
                      <Button className="w-full bg-primary text-white hover:bg-blue-700 transition-all group">
                        <span className="mr-2">Learn More</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Button>
                    </Link>
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

const PopularTopics = () => {
  const topics = [
    {
      title: "Diamond 4Cs Guide",
      description: "Complete guide to Cut, Color, Clarity, and Carat",
      category: "Diamonds",
      readTime: "8 min read",
      href: "/education/diamond"
    },
    {
      title: "Gemstone Hardness Scale",
      description: "Understanding Mohs scale and gemstone durability",
      category: "Gemstones",
      readTime: "5 min read",
      href: "/education/gemstones"
    },
    {
      title: "Gold Purity Guide",
      description: "Learn about karats, hallmarks, and gold types",
      category: "Metals",
      readTime: "6 min read",
      href: "/education/metals"
    },
    {
      title: "Ring Setting Types",
      description: "Compare prong, bezel, tension, and more settings",
      category: "Jewelry",
      readTime: "7 min read",
      href: "/education/jewelry"
    },
    {
      title: "Birthstone Meanings",
      description: "Discover the symbolism behind each month's gemstone",
      category: "Gemstones",
      readTime: "10 min read",
      href: "/education/gemstones"
    },
    {
      title: "Diamond Shape Guide",
      description: "Round, princess, emerald, and all diamond shapes explained",
      category: "Diamonds",
      readTime: "12 min read",
      href: "/education/diamond"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Popular Education Topics
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Most-read guides covering essential jewelry knowledge for confident purchasing decisions.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                    {topic.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {topic.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {topic.description}
                </p>
                <Link href={topic.href}>
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
        Ready to Become a Jewelry Expert?
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
        Start with our comprehensive education guides and gain the confidence to make perfect jewelry selections.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/30">
          Browse All Guides
        </Button>
        <Button variant="outline" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
          Talk to Expert
        </Button>
      </div>
    </div>
  </section>
);

export default function EducationHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationUser />
      <main>
        <HeroSection />
        <div className="container mx-auto px-6" style={{ maxWidth: SECTION_WIDTH }}>
          <EducationCategories />
          <PopularTopics />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
