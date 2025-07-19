'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Code, Award, CheckCircle } from 'lucide-react';
import { roadmapData } from '@/data/roadmapData';

export default function RoadmapPreview({ careerId }) {
  // Get roadmap data for the career
  const roadmap = roadmapData[careerId];
  
  if (!roadmap) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6">Roadmap Preview</h2>
      <p className="text-xl text-white/90 mb-8">
        This career path includes {roadmap.milestones.length} milestones over approximately {roadmap.estimatedDuration}.
      </p>
      
      <div className="space-y-8">
        {roadmap.milestones.slice(0, 2).map((milestone, index) => (
          <Card key={index} className="bg-white/95 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <CardTitle>{milestone.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{milestone.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {milestone.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              {milestone.resources && milestone.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Learning Resources
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {milestone.resources.slice(0, 2).map((resource, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        {resource.title} ({resource.type})
                      </li>
                    ))}
                    {milestone.resources.length > 2 && (
                      <li className="text-xs text-muted-foreground">
                        + {milestone.resources.length - 2} more resources
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {milestone.projects && milestone.projects.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Projects
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {milestone.projects.map((project, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        {project.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {milestone.certifications && milestone.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certifications
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {milestone.certifications.map((cert, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        {cert.title} by {cert.provider}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {roadmap.milestones.length > 2 && (
          <div className="text-center">
            <p className="text-white/80 mb-4">
              + {roadmap.milestones.length - 2} more milestones in the complete roadmap
            </p>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              View Full Roadmap
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}