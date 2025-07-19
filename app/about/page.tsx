import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Lightbulb, Award, ArrowRight } from "lucide-react";
import { FC } from 'react';

const About: FC = () => {
  const values = [
    {
      icon: Target,
      title: "Personalized Guidance",
      description: "Every career journey is unique. Our AI-powered platform creates customized roadmaps tailored to your background and goals."
    },
    {
      icon: Users,
      title: "Community Driven", 
      description: "Join a community of learners and professionals sharing experiences, tips, and support on their career journeys."
    },
    {
      icon: Lightbulb,
      title: "Continuous Innovation",
      description: "We continuously evolve our platform with the latest industry trends and technologies to keep you ahead of the curve."
    },
    {
      icon: Award,
      title: "Proven Success",
      description: "Thousands of users have successfully transitioned to their dream careers using our comprehensive guidance system."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      description: "Former Google product manager with 10+ years in career development",
      image: "👩‍💼"
    },
    {
      name: "Marcus Johnson", 
      role: "CTO & Co-founder",
      description: "AI expert and former Stanford researcher specializing in personalized learning",
      image: "👨‍💻"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Career Services",
      description: "Career counselor with 15+ years helping thousands find their ideal paths",
      image: "👩‍🎓"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                CareerMap
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              We're on a mission to democratize career guidance and help everyone find their perfect professional path with the power of AI and personalized learning.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="max-w-4xl mx-auto mb-20 bg-white/10 backdrop-blur-md border-white/20 animate-slide-up">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-white/90 leading-relaxed">
                To bridge the gap between education and career readiness by providing personalized, 
                AI-powered guidance that adapts to each individual's unique background, skills, and aspirations. 
                We believe everyone deserves access to world-class career guidance, regardless of their starting point.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card 
                    key={value.title}
                    className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card 
                  key={member.name}
                  className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{member.image}</div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <Card className="max-w-4xl mx-auto mb-20 bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                  <p className="text-white/80">Users Guided</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">95%</div>
                  <p className="text-white/80">Success Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">500+</div>
                  <p className="text-white/80">Career Paths</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-white/80 mb-6">
                  Join thousands of professionals who have found their dream careers with CareerMap.
                </p>
                <Button variant="hero" size="lg">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
