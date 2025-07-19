"use client";

import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Brain, Filter, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate AI search - in production this would call your AI service
    setTimeout(() => {
      setIsSearching(false);
      // Here you would display AI-generated career suggestions
    }, 2000);
  };

  const categories = [
    { name: "Technology", count: 25, color: "from-blue-500 to-cyan-500" },
    { name: "Design", count: 18, color: "from-purple-500 to-pink-500" },
    { name: "Business", count: 22, color: "from-green-500 to-emerald-500" },
    { name: "Healthcare", count: 15, color: "from-red-500 to-orange-500" },
    { name: "Marketing", count: 12, color: "from-yellow-500 to-orange-500" },
    { name: "Education", count: 10, color: "from-indigo-500 to-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                Dream Career
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Explore thousands of career paths with AI-powered recommendations tailored to your skills and interests.
            </p>
          </div>

          {/* AI Search Section */}
          <Card className="max-w-4xl mx-auto mb-16 bg-white/10 backdrop-blur-md border-white/20 animate-slide-up">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Career Search</h3>
                  <p className="text-white/70">Describe your interests and get personalized career suggestions</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="e.g., I love creating digital art and working with technology..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/90 border-white/30"
                    onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
                  />
                </div>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleAISearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-14 px-8"
                >
                  {isSearching ? 'Searching...' : 'Search with AI'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card 
                  key={category.name}
                  className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Filter className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.count} career paths available
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Explore {category.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-white/80 mb-6">
                  Sign up today and get your personalized career roadmap in minutes.
                </p>
                <Button variant="hero" size="lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
