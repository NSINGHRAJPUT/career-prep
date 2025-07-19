'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Map, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  const handleStartJourney = () => {
    // router.push('/signin');
  };

  const handleExploreCareers = () => {
    const careerSection = document.getElementById('career-grid');
    careerSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 flex flex-col items-center text-center">
        {/* Main heading */}
        <div className="max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Career Journey
            </span>{" "}
            Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-delayed-fade">
            AI-powered personalized roadmaps to help you navigate your dream career path with confidence and clarity.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-delayed-slide">
          <Button variant="hero" size="xl" className="group" onClick={handleStartJourney}>
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={handleExploreCareers}>
            Explore Careers
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl animate-scale-in">
          <div className="flex flex-col items-center text-white/90 group">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalized Plans</h3>
            <p className="text-sm text-white/70 text-center">
              Tailored roadmaps based on your background and goals
            </p>
          </div>

          <div className="flex flex-col items-center text-white/90 group">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-white/70 text-center">
              Smart recommendations powered by advanced AI technology
            </p>
          </div>

          <div className="flex flex-col items-center text-white/90 group">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Step-by-Step</h3>
            <p className="text-sm text-white/70 text-center">
              Clear milestones and progress tracking for your journey
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
