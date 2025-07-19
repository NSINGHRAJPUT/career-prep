'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CareerDetail from '@/components/CareerDetail';

interface Career {
  _id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  educationRequirements: string;
  careerPath: string;
  salaryRanges: {
    entry: string;
    mid: string;
    senior: string;
  };
  trends: string;
  isAIGenerated: boolean;
  estimatedDuration?: string;
  milestones?: any[];
}

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('CareerDetailPage mounted with id:', id);
    

    const fetchCareer = async () => {
      try {
        console.log('Starting fetchCareer function');
        let careerFound = false;
        
        const cleanId = typeof id === 'string' ? id.replace(/"/g, '') : id;
        
        import('@/data/roadmapData').then(({ roadmapData }: any) => {
          console.log('Loaded roadmap data', roadmapData);
          const careerKeyMap = {
            'Frontend Developer': 'frontend-developer',
            'UX Designer': 'ux-designer', 
            'Backend Developer': 'backend-dev',
            'DevOps Engineer': 'devops-engineer',
            'Full Stack Developer': 'fullstack-dev',
            'Mobile Developer': 'mobile-dev',
            'Cloud Engineer': 'cloud-engineer',
            'AI Engineer': 'ai-engineer',
            'Cybersecurity Specialist': 'cybersecurity-analyst',
          };

          // Special case for Data Scientist
          if (cleanId === 'Data Scientist') {
            console.log('Found Data Scientist');
            const roadmapCareer = roadmapData['data-scientist'];
            
            setCareer({
              _id: 'data-scientist',
              title: roadmapCareer.title,
              description: roadmapCareer.description,
              category: 'Tech',
              skills: roadmapCareer.milestones?.flatMap((m:any) => m.skills || []) || [],
              educationRequirements: 'Bachelor\'s degree in Computer Science or related field, or equivalent experience',
              careerPath: `Career path with ${roadmapCareer.milestones?.length || 0} milestones over ${roadmapCareer.estimatedDuration}`,
              salaryRanges: {
                entry: '$60,000 - $80,000',
                mid: '$80,000 - $120,000',
                senior: '$120,000 - $180,000'
              },
              trends: 'Growing demand for professionals with expertise in this field',
              isAIGenerated: false,
              estimatedDuration: roadmapCareer.estimatedDuration,
              milestones: roadmapCareer.milestones
            });
            
            careerFound = true;
            setIsLoading(false);
            localStorage.setItem('selectedCareer', roadmapCareer.title);
            return;
          }

          const roadmapKey =
            careerKeyMap[cleanId as keyof typeof careerKeyMap] ||
            (typeof cleanId === 'string'
              ? decodeURIComponent(cleanId).toLowerCase().replace(/\s+/g, '-').replace(/%22/g, '')
              : '');

          console.log('Selected career roadmap key:', roadmapKey.replace(/['"]/g, ''), roadmapData[roadmapKey.replace(/['"]/g, '')]);
                
          if (roadmapData[roadmapKey.replace(/['"]/g, '')]) {
            console.log('Found matching roadmap data');
            const roadmapCareer = roadmapData[roadmapKey.replace(/['"]/g, '')];
            
            setCareer({
              _id: roadmapKey,
              title: roadmapCareer.title,
              description: roadmapCareer.description,
              category: 'Tech',
              skills: roadmapCareer.milestones?.flatMap((m:any) => m.skills || []) || [],
              educationRequirements: 'Bachelor\'s degree in Computer Science or related field, or equivalent experience',
              careerPath: `Career path with ${roadmapCareer.milestones?.length || 0} milestones over ${roadmapCareer.estimatedDuration}`,
              salaryRanges: {
                entry: '$60,000 - $80,000',
                mid: '$80,000 - $120,000',
                senior: '$120,000 - $180,000'
              },
              trends: 'Growing demand for professionals with expertise in this field',
              isAIGenerated: false,
              estimatedDuration: roadmapCareer.estimatedDuration,
              milestones: roadmapCareer.milestones
            });
            
            careerFound = true;
            setIsLoading(false);
            localStorage.setItem('selectedCareer', roadmapCareer.title);
          } else {
            console.log('No matching roadmap data found for key:', roadmapKey);
          }
        }).catch(err => {
          console.error('Error loading roadmap data:', err);
        });

        // if (!careerFound) {
        //   const response = await fetch(`/api/careers/${cleanId}`);
          
        //   if (!response.ok) {
        //     throw new Error('Failed to fetch career details');
        //   }

        //   const data = await response.json();
        //   setCareer(data.data);
        // }
      } catch (err) {
        console.error('Error fetching career:', err);
        setError('Failed to load career details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCareer();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/90">Loading career details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-white/90 mb-4">{error}</p>
              <p className="text-white/70">Please try again or explore other careers.</p>
            </div>
          ) : career ? (
            <CareerDetail career={career} isAuthenticated={isAuthenticated} />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-white/90">Career not found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}