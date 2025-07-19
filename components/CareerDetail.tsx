'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Book, Link2, Timer, Code, Target, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { Progress } from '@/components/ui/progress';

interface CareerDetailProps {
  career: any;
  isAuthenticated: boolean;
}

export default function CareerDetail({ career, isAuthenticated }: CareerDetailProps) {
  const { toast } = useToast();
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Check if we have detailed milestone data
  const hasDetailedMilestones = career.milestones && 
    career.milestones.length > 0 && 
    career.milestones[0].resources;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
          {career?.title}
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
          {career?.description}
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge className="px-4 py-2 text-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Timer className="w-5 h-5 mr-2" />
            {career?.estimatedDuration || "6-8 months"}
          </Badge>
          <Badge className="px-4 py-2 text-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Target className="w-5 h-5 mr-2" />
            {career?.milestones?.length || 0} Milestones
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid grid-cols-5 max-w-2xl mx-auto bg-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {hasDetailedMilestones ? (
              career.milestones.map((milestone: any, index: number) => (
                <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Code className="w-5 h-5 text-blue-400" />
                      {milestone.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">{milestone.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {milestone.skills?.map((skill: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-blue-500/30 text-blue-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                      <span>Duration: {milestone.duration}</span>
                      <span>{milestone.projects?.length || 0} Projects</span>
                    </div>
                    {/* Projects */}
                    {milestone.projects?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Projects:</h4>
                        <ul className="list-disc list-inside text-white/80">
                          {milestone.projects.map((project: any, i: number) => (
                            <li key={i} className="mb-1">
                              <span className="font-medium">{project.title}:</span> {project.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Resources */}
                    {milestone.resources?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Resources:</h4>
                        <ul className="list-disc list-inside text-white/80">
                          {milestone.resources.map((resource: any, i: number) => (
                            <li key={i} className="mb-1">
                              <span className="font-medium">{resource.title}:</span> {resource.description} {' '}
                              <Button
                                variant="link"
                                className="text-blue-400 px-1 py-0 h-auto"
                                onClick={() => window.open(resource.link, '_blank')}
                              >
                                Access
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Certifications */}
                    {milestone.certifications?.length > 0 && (
                      <div className="mb-2">
                        <h4 className="font-semibold text-white mb-2">Certifications:</h4>
                        <ul className="list-disc list-inside text-white/80">
                          {milestone.certifications.map((cert: any, i: number) => (
                            <li key={i} className="mb-1">
                              <span className="font-medium">{cert.title}</span> by {cert.provider} {' '}
                              <Button
                                variant="link"
                                className="text-blue-400 px-1 py-0 h-auto"
                                onClick={() => window.open(cert.link, '_blank')}
                              >
                                View
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Career Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 mb-4">{career?.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Education Requirements</h4>
                      <p className="text-white/70">{career?.educationRequirements}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Career Path</h4>
                      <p className="text-white/70">{career?.careerPath}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Entry Level</h4>
                      <p className="text-white/70">{career?.salaryRanges?.entry}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Mid Level</h4>
                      <p className="text-white/70">{career?.salaryRanges?.mid}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Senior Level</h4>
                      <p className="text-white/70">{career?.salaryRanges?.senior}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Industry Trends</h4>
                    <p className="text-white/70">{career?.trends}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <Timeline>
            {hasDetailedMilestones ? (
              career.milestones.map((milestone: any, index: number) => (
                <TimelineItem
                  key={index}
                  title={milestone.title}
                  description={milestone.description}
                  icon={<GraduationCap className="w-5 h-5" />}
                >
                  <div className="space-y-4 mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {milestone.skills?.map((skill: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-blue-500/30 text-blue-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-white/70 mb-4">Duration: {milestone.duration}</div>
                    
                    <h4 className="font-semibold text-white">Projects:</h4>
                    {milestone.projects?.map((project: any, i: number) => (
                      <Card key={i} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h5 className="font-medium text-white mb-2">{project.title}</h5>
                          <p className="text-white/70 text-sm">{project.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TimelineItem>
              ))
            ) : (
              <div className="text-white/70">No detailed milestone information available.</div>
            )}
          </Timeline>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid md:grid-cols-2 gap-6">
            {hasDetailedMilestones ? (
              career.milestones.flatMap((milestone: any) => 
                milestone.resources?.map((resource: any, index: number) => (
                  <Card key={`${milestone.title}-${index}`} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        {resource.type === 'book' ? (
                          <Book className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Link2 className="w-5 h-5 text-purple-400" />
                        )}
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/70 mb-4">{resource.description}</p>
                      <Button
                        variant="outline"
                        className="w-full bg-white/5 border-white/10 hover:bg-white/10"
                        onClick={() => window.open(resource.link, '_blank')}
                      >
                        Access Resource
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )
            ) : (
              <div className="text-white/70 col-span-2">No resource information available.</div>
            )}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {hasDetailedMilestones && career.milestones.some((m: any) => m.certifications?.length > 0) ? (
              career.milestones.flatMap((milestone: any) => 
                milestone.certifications?.map((cert: any, i: number) => (
                  <Card key={`${milestone.title}-cert-${i}`} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <GraduationCap className="w-5 h-5 text-blue-400" />
                        {cert.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-2">Provider: {cert.provider}</p>
                      <Button
                        variant="outline"
                        className="w-full bg-white/5 border-white/10 hover:bg-white/10"
                        onClick={() => window.open(cert.link, '_blank')}
                      >
                        View Certificate
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )
            ) : (
              <div className="text-white/70 col-span-2">No certifications available.</div>
            )}
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {hasDetailedMilestones ? (
              career.milestones.flatMap((milestone: any) => 
                milestone.projects?.map((project: any, i: number) => (
                  <Card key={`${milestone.title}-project-${i}`} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Code className="w-5 h-5 text-blue-400" />
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/70">{project.description}</p>
                      <div className="mt-4 text-white/50 text-sm">
                        From milestone: {milestone.title}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
            ) : (
              <div className="text-white/70 col-span-2">No projects available.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex justify-center">
        <Button
          variant="hero"
          size="lg"
          onClick={() => {
            localStorage.setItem('selectedCareer', career.title);
            router.push(`/roadmap/start?careerId=${career._id}`);
          }}
          className="px-8"
        >
          Start This Career Path
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}