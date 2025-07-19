'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle, PlayCircle, ArrowRight, Brain } from 'lucide-react';

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  milestones: any[];
  career: {
    _id: string; 
    title: string;
    description: string;
    category: string;
  };
  isAIGenerated: boolean;
  createdAt: string;
}

interface UserProgress {
  _id: string;
  roadmap: Roadmap;
  overallProgress: number;
  milestoneProgress: any[];
  isCompleted: boolean;
  startedAt: string;
  lastUpdatedAt: string;
}

export default function Dashboard() {
  const [userRoadmaps, setUserRoadmaps] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // State for selected career from sessionStorage
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedCareerData, setSelectedCareerData] = useState<any>(null);

    useEffect(() => {
    // Check if user is authenticated
    let token;
    try {
      console.log('Checking authentication...');
      token = localStorage.getItem('token');
      
      // Check for selected career in localStorage
      const storedCareer = localStorage.getItem('selectedCareer');
      console.log('Stored career:', storedCareer);
      
      if (storedCareer) {
        console.log('Setting selected career:', JSON.parse(storedCareer));

        setSelectedCareer(storedCareer);
        
       
          // For other careers, try to load from roadmapData
          import('@/data/roadmapData').then(({ roadmapData }: any) => {
            console.log('Loaded roadmap data', roadmapData);
            const careerKeyMap = {
              'Frontend Developer': 'frontend-dev',
              'UX Designer': 'ux-designer',
              'Backend Developer': 'backend-dev',
              'DevOps Engineer': 'devops-engineer',
              'Full Stack Developer': 'fullstack-dev',
              'Mobile Developer': 'mobile-dev',
              'Cloud Engineer': 'cloud-engineer',
              'AI Engineer': 'ai-engineer',
              'Cybersecurity Specialist': 'cybersecurity-analyst',
            };

              const roadmapKey = careerKeyMap[storedCareer as keyof typeof careerKeyMap] || storedCareer.toLowerCase().replace(/\s+/g, '-');
              console.log('Selected career roadmap key:', roadmapKey, roadmapData[roadmapKey.replace(/['"]/g, '')]);
            if ( roadmapData[roadmapKey.replace(/['"]/g, '')]) {
              console.log('Found matching roadmap data');
              setSelectedCareerData(roadmapData[roadmapKey.replace(/['"]/g, '')]);
              setSelectedCareer(storedCareer);
              console.log('Selected Career Data:', roadmapData[roadmapKey.replace(/['"]/g, '')],selectedCareer);
            } else {
              console.log('No matching roadmap data found for key:', roadmapKey);
            }
          }).catch(err => {
            console.error('Error loading roadmap data:', err);
          });
        }
      
      
      if (!token) {
        console.log('No auth token found, redirecting to signin');
        // Redirect to login if no token found
        router.push('/signin');
        return;
      }
    } catch (error) {
      // Handle case where localStorage is not available (SSR)
      console.error('Error accessing localStorage:', error);
      // We'll let the component render and then redirect on the client side
      return;
    }
    
    const fetchUserRoadmaps = async () => {
      console.log('Fetching user roadmaps...');
      try {
        // const response = await fetch('/api/progress', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        
        // if (response.status === 401) {
        //   // Token is invalid or expired
        //   // localStorage.removeItem('token');
        //   // router.push('/signin');
        //   return;
        // }
        
        // if (!response.ok) {
        //   throw new Error('Failed to fetch roadmaps');
        // }
        
        // const data = await response.json();
        // setUserRoadmaps(data.data);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        console.log('Loading demo data instead');
        // Show static demo data if API fails
        setUserRoadmaps([
          {
            _id: 'demo1',
            roadmap: {
              _id: 'roadmap1',
              title: 'Frontend Developer',
              description: 'Learn HTML, CSS, JavaScript, React, and more.',
              estimatedDuration: '3 months',
              milestones: [{}, {}, {}],
              career: {
                _id: 'career1',
                title: 'Frontend Developer',
                description: 'Build beautiful web interfaces.',
                category: 'Tech',
              },
              isAIGenerated: false,
              createdAt: '',
            },
            overallProgress: 40,
            milestoneProgress: [{ isCompleted: true }, { isCompleted: false }, { isCompleted: false }],
            isCompleted: false,
            startedAt: '',
            lastUpdatedAt: '',
          },
        ]);
        setError('Showing demo data. API failed.');
      } finally {
        console.log('Finished fetching roadmaps');
        setIsLoading(false);
      }
    };
    
    fetchUserRoadmaps();
  }, [router]);

  const handleContinueLearning = (roadmapId: string) => {
    router.push(`/roadmap/${roadmapId}`);
  };

  // Check if we're on the client side and if the user is authenticated
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // If we're on the client side and there's no token, show a message
  if (isClient && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-xl text-white/90 mb-4">Please sign in to view your dashboard</p>
              <Button 
                variant="default" 
                onClick={() => router.push('/signin')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                Career Journey
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Track your progress, manage your learning path, and achieve your career goals.
            </p>
            
            {/* Selected Career Notice */}
            {/* {selectedCareer && ( */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-2xl mx-auto mb-8">
                {selectedCareerData ? (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{selectedCareerData.title}</h3>
                    <p className="text-white/90 mb-3">{selectedCareerData.description}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white/70">{selectedCareerData.estimatedDuration}</span>
                      <span className="mx-2 text-white/50">•</span>
                      <BookOpen className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white/70">{selectedCareerData.milestones?.length || 0} milestones</span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button 
                        variant="hero" 
                        size="sm"
                        onClick={() => {
                          router.push(`/career/${selectedCareer}`);
                        }}
                      >
                        View Career Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/10"
                        onClick={() => {
                          router.push(`/roadmap/start?careerId=${selectedCareer}`);
                        }}
                      >
                        Start This Roadmap
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Selected Career</h3>
                    <p className="text-white/90 mb-3">You have a custom career path waiting to be explored.</p>
                    <div className="mt-4 flex gap-3">
                      <Button 
                        variant="hero" 
                        size="sm"
                        onClick={() => {
                          router.push(`/career/${selectedCareer}`);
                        }}
                      >
                        View Career Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/10"
                        onClick={() => {
                          router.push(`/roadmap/create?careerId=${selectedCareer}`);
                        }}
                      >
                        Generate AI Roadmap
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            {/* )} */}
          </div>

          {/* Roadmaps Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">My Roadmaps</h2>
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => router.push('/careers')}
              >
                Explore More Careers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/90">Loading your roadmaps...</p>
              </div>
            ) : error ? (
              <Card className="bg-white/95 backdrop-blur-md border-white/20 p-8 text-center">
                <p className="text-lg text-red-500 mb-4">{error}</p>
                <Button 
                  variant="default" 
                  onClick={() => router.push('/careers')}
                >
                  Explore Careers
                </Button>
              </Card>
            ) : userRoadmaps.length === 0 ? (
              <Card className="bg-white/95 backdrop-blur-md border-white/20 p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">No Roadmaps Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't started any career roadmaps yet. Explore careers to find your path.
                </p>
                <Button 
                  variant="default" 
                  onClick={() => router.push('/careers')}
                >
                  Explore Careers
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6">
                {userRoadmaps.map((progress, index) => (
                  <Card 
                    key={progress._id}
                    className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-semibold text-foreground">
                              {progress.roadmap.title}
                            </h3>
                            <Badge 
                              variant={progress.isCompleted ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {progress.isCompleted ? 'Completed' : 'In Progress'}
                            </Badge>
                            {progress.roadmap.isAIGenerated && (
                              <Badge variant="outline" className="text-xs">
                                AI Generated
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {progress.roadmap.description}
                          </p>

                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-foreground">
                                Progress
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {progress.overallProgress}%
                              </span>
                            </div>
                            <Progress value={progress.overallProgress} className="h-2" />
                          </div>

                          {/* Stats */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {progress.roadmap.estimatedDuration}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {progress.roadmap.milestones?.length || 0} milestones
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {progress.milestoneProgress?.filter(m => m.isCompleted).length || 0} completed
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="lg:w-48 flex flex-col gap-3">
                          <Button 
                            variant={progress.isCompleted ? "outline" : "default"}
                            size="lg" 
                            className="w-full"
                            onClick={() => handleContinueLearning(progress.roadmap._id)}
                          >
                            {progress.isCompleted ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                View Certificate
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Continue Learning
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => router.push(`/roadmap/${progress.roadmap._id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* AI Roadmap Generator */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Need a Custom Roadmap?
                </h3>
                <p className="text-white/80 mb-6">
                  Let our AI create a personalized learning path based on your specific goals and background.
                </p>
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => router.push('/roadmap/create')}
                >
                  Create Custom Roadmap
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
