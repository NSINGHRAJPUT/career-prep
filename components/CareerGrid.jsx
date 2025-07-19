'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Palette, Briefcase, Stethoscope, TrendingUp, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { roadmapData } from '@/data/roadmapData';

const categoryIcons = {
  'Technology': Code,
  'Design': Palette,
  'Business': Briefcase,
  'Healthcare': Stethoscope,
  'Marketing': TrendingUp,
  'Education': GraduationCap,
};

export default function CareerGrid() {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch('/api/careers');
        if (!response.ok) {
          throw new Error('Failed to fetch careers');
        }
        const data = await response.json();
        setCareers(data.data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const handleCareerClick = (careerId) => {
    router.push(`/career/${careerId}`);
  };

  // Predefined careers with detailed roadmap data
  const predefinedCareers = [
    {
      _id: 'frontend-dev',
      title: roadmapData['frontend-dev'].title,
      description: roadmapData['frontend-dev'].description,
      category: 'Technology',
      skills: roadmapData['frontend-dev'].milestones.flatMap(m => m.skills).slice(0, 4),
      estimatedDuration: roadmapData['frontend-dev'].estimatedDuration,
      milestones: roadmapData['frontend-dev'].milestones.length
    },
    {
      _id: 'data-scientist',
      title: roadmapData['data-scientist'].title,
      description: roadmapData['data-scientist'].description,
      category: 'Technology',
      skills: roadmapData['data-scientist'].milestones.flatMap(m => m.skills).slice(0, 4),
      estimatedDuration: roadmapData['data-scientist'].estimatedDuration,
      milestones: roadmapData['data-scientist'].milestones.length
    },
    {
      _id: 'ux-designer',
      title: roadmapData['ux-designer'].title,
      description: roadmapData['ux-designer'].description,
      category: 'Design',
      skills: roadmapData['ux-designer'].milestones.flatMap(m => m.skills).slice(0, 4),
      estimatedDuration: roadmapData['ux-designer'].estimatedDuration,
      milestones: roadmapData['ux-designer'].milestones.length
    },
    {
      _id: 'product-manager',
      title: 'Product Manager',
      description: 'Lead product development and strategy to meet user needs',
      category: 'Business',
      skills: ['Strategy', 'User Stories', 'Roadmapping', 'Analytics'],
      estimatedDuration: '3-5 months',
      milestones: 4
    },
    {
      _id: 'digital-marketer',
      title: 'Digital Marketer',
      description: 'Drive growth through digital channels and marketing campaigns',
      category: 'Marketing',
      skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
      estimatedDuration: '2-4 months',
      milestones: 5
    },
    {
      _id: 'backend-dev',
      title: 'Backend Developer',
      description: 'Build server-side applications and APIs for web services',
      category: 'Technology',
      skills: ['Node.js', 'Python', 'Databases', 'API Design'],
      estimatedDuration: '4-6 months',
      milestones: 4
    }
  ];

  // Use predefined careers if API returns empty array
  const displayCareers = careers.length > 0 ? careers : predefinedCareers;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explore Career Paths
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover detailed roadmaps for in-demand careers across various industries
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted rounded-md w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded-md w-5/6 mb-6"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-muted rounded-full w-16"></div>
                    <div className="h-6 bg-muted rounded-full w-20"></div>
                  </div>
                  <div className="h-10 bg-muted rounded-md w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCareers.map((career, index) => {
              const IconComponent = categoryIcons[career.category] || Code;
              
              return (
                <Card 
                  key={career._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleCareerClick(career._id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {career.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge>{career.category}</Badge>
                      {career.isAIGenerated && (
                        <Badge variant="outline">AI Generated</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      {career.estimatedDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {career.estimatedDuration}
                        </div>
                      )}
                      {career.milestones && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {career.milestones} milestones
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View Career Path
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            variant="default" 
            size="lg"
            onClick={() => router.push('/careers')}
          >
            View All Careers
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}