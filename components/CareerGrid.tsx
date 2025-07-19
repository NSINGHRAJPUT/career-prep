'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Palette, BarChart3, Shield, Camera, Cpu, Users, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const careers = [
  {
    title: "Frontend Developer", 
    description: "Build beautiful and interactive user interfaces",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    skills: ["React", "TypeScript", "CSS"],
    timeframe: "6-12 months"
  },
  {
    title: "UX Designer",
    description: "Design intuitive and engaging user experiences",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    skills: ["Figma", "Design Systems", "User Research"],
    timeframe: "4-8 months"
  },
  {
    title: "Data Scientist",
    description: "Extract insights from data to drive decisions",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    skills: ["Python", "Machine Learning", "Statistics"],
    timeframe: "8-15 months"
  },
  {
    title: "Cybersecurity Specialist",
    description: "Protect systems and data from digital threats",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    skills: ["Network Security", "Ethical Hacking", "Risk Assessment"],
    timeframe: "6-12 months"
  },
  {
    title: "Product Manager",
    description: "Guide product development from concept to launch",
    icon: Briefcase,
    color: "from-indigo-500 to-blue-500",
    skills: ["Strategy", "Analytics", "Leadership"],
    timeframe: "3-6 months"
  },
  {
    title: "DevOps Engineer",
    description: "Streamline development and deployment processes",
    icon: Cpu,
    color: "from-yellow-500 to-orange-500",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    timeframe: "6-10 months"
  },
  {
    title: "Digital Marketer",
    description: "Drive growth through digital marketing strategies",
    icon: Users,
    color: "from-pink-500 to-rose-500",
    skills: ["SEO", "Social Media", "Analytics"],
    timeframe: "3-6 months"
  },
  {
    title: "Content Creator",
    description: "Create engaging content across digital platforms",
    icon: Camera,
    color: "from-violet-500 to-purple-500",
    skills: ["Video Editing", "Storytelling", "Social Media"],
    timeframe: "2-4 months"
  }
];

const CareerGrid = () => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const handleStartPath = (careerTitle: string) => {
    localStorage.setItem('selectedCareer', JSON.stringify(careerTitle));
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  const handleAISearch = () => {
    setIsSearching(true);
    router.push('/careers');
  };

  return (
    <section id="career-grid" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Career Paths
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover diverse career opportunities and find the perfect path that matches your interests and skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {careers.map((career, index) => {
            const Icon = career.icon;
            return (
              <Card 
                key={career.title} 
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${career.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {career.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {career.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Key Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {career.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {career.timeframe}
                      </span>
                      <Button 
                        variant="career" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleStartPath(career.title)}
                      >
                        Start Path
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="glow" 
            size="lg"
            onClick={handleAISearch}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : "Don't see your career? Search with AI"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareerGrid;
