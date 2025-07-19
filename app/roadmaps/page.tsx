import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle, PlayCircle, ArrowRight, Star } from "lucide-react";

const Roadmaps = () => {
  const roadmaps = [
    {
      id: 1,
      title: "Frontend Developer",
      description: "Master modern web development with React, TypeScript, and advanced CSS",
      progress: 75,
      status: "In Progress",
      timeRemaining: "3 weeks",
      modules: 8,
      completed: 6,
      difficulty: "Intermediate",
      features: ["Interactive Projects", "Code Reviews", "Career Mentoring"]
    },
    {
      id: 2,
      title: "Data Scientist",
      description: "Learn Python, machine learning, and statistical analysis for data-driven insights",
      progress: 45,
      status: "In Progress", 
      timeRemaining: "6 weeks",
      modules: 12,
      completed: 5,
      difficulty: "Advanced",
      features: ["Real Datasets", "ML Projects", "Industry Mentors"]
    },
    {
      id: 3,
      title: "UI/UX Designer",
      description: "Design beautiful and user-friendly interfaces using modern design principles",
      progress: 100,
      status: "Completed",
      timeRemaining: "Completed",
      modules: 6,
      completed: 6,
      difficulty: "Beginner",
      features: ["Design Portfolio", "User Testing", "Design Systems"]
    }
  ];

  const featuredRoadmaps = [
    {
      title: "Full Stack Developer",
      description: "End-to-end web development with modern technologies",
      duration: "4-6 months",
      students: "2.5k",
      rating: 4.8
    },
    {
      title: "DevOps Engineer", 
      description: "Master cloud infrastructure and deployment automation",
      duration: "3-5 months",
      students: "1.8k",
      rating: 4.9
    },
    {
      title: "Product Manager",
      description: "Learn product strategy, user research, and team leadership",
      duration: "2-4 months", 
      students: "3.2k",
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Career
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                Roadmaps
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Track your progress, manage your learning journey, and achieve your career goals with our personalized roadmaps.
            </p>
          </div>

          {/* My Roadmaps Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">My Active Roadmaps</h2>
            <div className="grid gap-6">
              {roadmaps.map((roadmap, index) => (
                <Card 
                  key={roadmap.id}
                  className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-semibold text-foreground">
                            {roadmap.title}
                          </h3>
                          <Badge 
                            variant={roadmap.status === "Completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {roadmap.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {roadmap.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {roadmap.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">
                              Progress: {roadmap.completed}/{roadmap.modules} modules
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {roadmap.progress}%
                            </span>
                          </div>
                          <Progress value={roadmap.progress} className="h-2" />
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {roadmap.timeRemaining}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {roadmap.modules} modules
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {roadmap.completed} completed
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {roadmap.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="lg:w-48 flex flex-col gap-3">
                        <Button 
                          variant={roadmap.status === "Completed" ? "outline" : "default"}
                          size="lg" 
                          className="w-full"
                        >
                          {roadmap.status === "Completed" ? (
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
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Roadmaps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Explore More Roadmaps</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRoadmaps.map((roadmap, index) => (
                <Card 
                  key={roadmap.title}
                  className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {roadmap.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {roadmap.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{roadmap.duration}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{roadmap.students}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{roadmap.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Start Roadmap
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Need a Custom Roadmap?
                </h3>
                <p className="text-white/80 mb-6">
                  Let our AI create a personalized learning path based on your specific goals and background.
                </p>
                <Button variant="hero" size="lg">
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
};

export default Roadmaps;