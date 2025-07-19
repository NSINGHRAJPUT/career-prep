'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, ArrowRight } from 'lucide-react';

export default function CreateRoadmap() {
  const [formData, setFormData] = useState({
    careerTitle: '',
    education: '',
    experience: '',
    skills: '',
    goals: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // router.push('/signin');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          careerTitle: formData.careerTitle,
          background: formData.goals,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills.split(',').map(skill => skill.trim())
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const data = await response.json();
      
      // Create progress record for the new roadmap
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roadmap: data.data._id
        })
      });

      // Redirect to the roadmap page
      router.push(`/roadmap/${data.data._id}`);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
      setIsGenerating(false);
    }
  };

  const popularCareers = [
    'Software Engineer',
    'Data Scientist',
    'UX Designer',
    'Product Manager',
    'Digital Marketer',
    'Cybersecurity Specialist',
    'Cloud Architect',
    'AI Engineer',
    'DevOps Engineer',
    'Blockchain Developer'
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Create Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                Custom Roadmap
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our AI will generate a personalized learning path based on your background, skills, and career goals.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md border-white/20 animate-slide-up">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                AI Roadmap Generator
              </CardTitle>
              <p className="text-muted-foreground">
                Fill in the details below to create your personalized career roadmap
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="careerTitle">Career Title</Label>
                  <Input
                    id="careerTitle"
                    name="careerTitle"
                    placeholder="e.g., Frontend Developer, Data Scientist, UX Designer"
                    value={formData.careerTitle}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <p className="text-sm text-muted-foreground w-full mb-1">Popular choices:</p>
                    {popularCareers.map(career => (
                      <Button
                        key={career}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, careerTitle: career }))}
                        className="text-xs"
                      >
                        {career}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Educational Background</Label>
                  <Textarea
                    id="education"
                    name="education"
                    placeholder="Describe your educational background, degrees, or certifications"
                    value={formData.education}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Work Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Describe your relevant work experience or projects"
                    value={formData.experience}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Current Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="List your current skills, separated by commas"
                    value={formData.skills}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Career Goals</Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    placeholder="Describe your career goals and what you want to achieve"
                    value={formData.goals}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="default" 
                  size="lg" 
                  className="w-full h-12"
                  disabled={isGenerating || !formData.careerTitle}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      Generate Roadmap
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}