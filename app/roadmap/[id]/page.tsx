'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, Clock, CheckCircle, Brain, ArrowRight, 
  GraduationCap, Code, Award, ExternalLink, Check
} from 'lucide-react';

interface Resource {
  _id: string;
  title: string;
  type: string;
  link: string;
  description: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
}

interface Certification {
  _id: string;
  title: string;
  provider: string;
  link: string;
}

interface Milestone {
  _id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: Resource[];
  projects: Project[];
  certifications: Certification[];
  order: number;
}

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  milestones: Milestone[];
  career: {
    _id: string;
    title: string;
    description: string;
    category: string;
  };
  isAIGenerated: boolean;
  createdAt: string;
  userBackground?: {
    education: string;
    experience: string;
    skills: string[];
  };
}

interface CompletedItem {
  itemType: 'resource' | 'project' | 'certification';
  itemId: string;
  completedAt: string;
}

interface MilestoneProgress {
  milestoneId: string;
  completedItems: CompletedItem[];
  isCompleted: boolean;
  completedAt?: string;
}

interface UserProgress {
  _id: string;
  roadmap: string;
  overallProgress: number;
  milestoneProgress: MilestoneProgress[];
  isCompleted: boolean;
  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
}

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/signin');
      return;
    }

    const fetchRoadmapAndProgress = async () => {
      try {
        // Fetch roadmap details
        const roadmapResponse = await fetch(`/api/roadmaps/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!roadmapResponse.ok) {
          throw new Error('Failed to fetch roadmap');
        }

        const roadmapData = await roadmapResponse.json();
        setRoadmap(roadmapData.data);

        // Fetch user progress for this roadmap
        const progressResponse = await fetch(`/api/progress?roadmap=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          if (progressData.data.length > 0) {
            setProgress(progressData.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching roadmap:', err);
        setError('Failed to load roadmap. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapAndProgress();
  }, [id, router]);

  const handleItemCompletion = async (milestoneId: string, itemType: 'resource' | 'project' | 'certification', itemId: string, completed: boolean) => {
    if (!progress) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/progress/${progress._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          milestoneId,
          itemType,
          itemId,
          completed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      setProgress(data.data);
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  const isItemCompleted = (milestoneId: string, itemType: string, itemId: string): boolean => {
    if (!progress) return false;
    
    const milestoneProgress = progress.milestoneProgress.find(
      mp => mp.milestoneId === milestoneId
    );
    
    if (!milestoneProgress) return false;
    
    return milestoneProgress.completedItems.some(
      item => item.itemType === itemType && item.itemId === itemId
    );
  };

  const getMilestoneProgress = (milestoneId: string): number => {
    if (!progress) return 0;
    
    const milestoneProgress = progress.milestoneProgress.find(
      mp => mp.milestoneId === milestoneId
    );
    
    if (!milestoneProgress) return 0;
    
    const milestone = roadmap?.milestones.find(m => m._id === milestoneId);
    if (!milestone) return 0;
    
    const totalItems = (milestone.resources?.length || 0) + 
                      (milestone.projects?.length || 0) + 
                      (milestone.certifications?.length || 0);
    
    if (totalItems === 0) return 0;
    
    return Math.round((milestoneProgress.completedItems.length / totalItems) * 100);
  };

  const isMilestoneCompleted = (milestoneId: string): boolean => {
    if (!progress) return false;
    
    const milestoneProgress = progress.milestoneProgress.find(
      mp => mp.milestoneId === milestoneId
    );
    
    return milestoneProgress?.isCompleted || false;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/90">Loading roadmap...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-white/90 mb-4">{error}</p>
              <Button 
                variant="default" 
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          ) : roadmap ? (
            <div className="animate-fade-in">
              {/* Header Section */}
              <div className="mb-12">
                <div className="flex flex-wrap gap-3 items-center mb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => router.push('/dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                  <Badge className="bg-gradient-primary text-white">
                    {roadmap.career?.category || 'Career Roadmap'}
                  </Badge>
                  {roadmap.isAIGenerated && (
                    <Badge variant="outline" className="text-white border-white/30">
                      AI Generated
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {roadmap.title}
                </h1>
                
                <p className="text-xl text-white/90 mb-6 leading-relaxed">
                  {roadmap.description}
                </p>
                
                <div className="flex flex-wrap gap-6 text-white/90 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Duration: {roadmap.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Milestones: {roadmap.milestones.length}</span>
                  </div>
                  {progress && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Progress: {progress.overallProgress}%</span>
                    </div>
                  )}
                </div>
                
                {progress && (
                  <Progress value={progress.overallProgress} className="h-2 bg-white/20 mb-8" />
                )}
              </div>

              {/* Milestones */}
              <div className="space-y-12 mb-16">
                {roadmap.milestones
                  .sort((a, b) => a.order - b.order)
                  .map((milestone, index) => (
                    <div key={milestone._id} className="relative">
                      {/* Timeline connector */}
                      {index < roadmap.milestones.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-white/20"></div>
                      )}
                      
                      <div className="flex gap-6">
                        {/* Milestone number */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          isMilestoneCompleted(milestone._id) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-white/20 text-white'
                        }`}>
                          {isMilestoneCompleted(milestone._id) ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span className="text-lg font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        {/* Milestone content */}
                        <div className="flex-1">
                          <Card className="bg-white/95 backdrop-blur-md border-white/20 mb-6">
                            <CardHeader>
                              <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                  <CardTitle className="text-2xl mb-2">
                                    {milestone.title}
                                  </CardTitle>
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {milestone.duration}
                                    </div>
                                    {progress && (
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Progress: {getMilestoneProgress(milestone._id)}%
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {progress && (
                                  <Badge variant={isMilestoneCompleted(milestone._id) ? "default" : "secondary"}>
                                    {isMilestoneCompleted(milestone._id) ? 'Completed' : 'In Progress'}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-6">
                                {milestone.description}
                              </p>
                              
                              {/* Skills */}
                              {milestone.skills && milestone.skills.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Skills to Acquire
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {milestone.skills.map((skill, i) => (
                                      <Badge key={i} variant="outline">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Resources */}
                              {milestone.resources && milestone.resources.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Learning Resources
                                  </h4>
                                  <div className="space-y-3">
                                    {milestone.resources.map((resource) => (
                                      <div 
                                        key={resource._id} 
                                        className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                      >
                                        <div 
                                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                                            isItemCompleted(milestone._id, 'resource', resource._id)
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-muted'
                                          }`}
                                          onClick={() => handleItemCompletion(
                                            milestone._id, 
                                            'resource', 
                                            resource._id, 
                                            !isItemCompleted(milestone._id, 'resource', resource._id)
                                          )}
                                        >
                                          <Check className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex flex-wrap justify-between gap-2">
                                            <h5 className="font-medium">{resource.title}</h5>
                                            <Badge variant="outline" className="text-xs">
                                              {resource.type}
                                            </Badge>
                                          </div>
                                          {resource.description && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                              {resource.description}
                                            </p>
                                          )}
                                        </div>
                                        {resource.link && (
                                          <a 
                                            href={resource.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                          >
                                            <ExternalLink className="w-5 h-5" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Projects */}
                              {milestone.projects && milestone.projects.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Code className="w-4 h-4" />
                                    Projects
                                  </h4>
                                  <div className="space-y-3">
                                    {milestone.projects.map((project) => (
                                      <div 
                                        key={project._id} 
                                        className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                      >
                                        <div 
                                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                                            isItemCompleted(milestone._id, 'project', project._id)
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-muted'
                                          }`}
                                          onClick={() => handleItemCompletion(
                                            milestone._id, 
                                            'project', 
                                            project._id, 
                                            !isItemCompleted(milestone._id, 'project', project._id)
                                          )}
                                        >
                                          <Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <h5 className="font-medium">{project.title}</h5>
                                          {project.description && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                              {project.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Certifications */}
                              {milestone.certifications && milestone.certifications.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    Certifications
                                  </h4>
                                  <div className="space-y-3">
                                    {milestone.certifications.map((certification) => (
                                      <div 
                                        key={certification._id} 
                                        className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                      >
                                        <div 
                                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                                            isItemCompleted(milestone._id, 'certification', certification._id)
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-muted'
                                          }`}
                                          onClick={() => handleItemCompletion(
                                            milestone._id, 
                                            'certification', 
                                            certification._id, 
                                            !isItemCompleted(milestone._id, 'certification', certification._id)
                                          )}
                                        >
                                          <Check className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex flex-wrap justify-between gap-2">
                                            <h5 className="font-medium">{certification.title}</h5>
                                            {certification.provider && (
                                              <span className="text-xs text-muted-foreground">
                                                by {certification.provider}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        {certification.link && (
                                          <a 
                                            href={certification.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                          >
                                            <ExternalLink className="w-5 h-5" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* AI Assistance */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shrink-0">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Need More Personalized Guidance?
                    </h3>
                    <p className="text-white/80 mb-4">
                      Our AI can provide more detailed learning resources and advice based on your specific background and goals.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 shrink-0"
                    onClick={() => router.push('/ai-assistant')}
                  >
                    Ask AI Assistant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-white/90">Roadmap not found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}