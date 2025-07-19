'use client';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        
        // Dispatch a custom event to notify other components about the auth change
        window.dispatchEvent(new Event('authChange'));
        
        // Check if there's a selected career to redirect to
        const selectedCareerId = sessionStorage.getItem('selectedCareerId');
        
        if (selectedCareerId) {
          // Clear the stored career ID
          sessionStorage.removeItem('selectedCareerId');
          
          // Redirect to the career page
          window.location.href = `/career/${selectedCareerId}`;
        } else {
          // Redirect to dashboard
          window.location.href = '/dashboard';
        }
      } else {
        // Handle error with toast
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: data.message || "Invalid credentials. Please try again."
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during authentication. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Personalized AI-generated career roadmaps",
    "Track your learning progress and milestones", 
    "Access to exclusive career resources and tools",
    "Community support from fellow learners",
    "Expert mentorship and career guidance",
    "Skill assessments and certification tracking"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Benefits */}
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {isSignUp ? 'Join' : 'Welcome Back to'}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                    CareerMap
                  </span>
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  {isSignUp 
                    ? 'Start your personalized career journey today and unlock your potential.'
                    : 'Continue your learning journey and achieve your career goals.'
                  }
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={benefit}
                      className="flex items-center gap-3 text-white/90"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Sign In Form */}
              <Card className="bg-white/95 backdrop-blur-md border-white/20 animate-slide-up">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {isSignUp 
                      ? 'Start your career transformation journey'
                      : 'Access your personalized roadmaps'
                    }
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="h-12"
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="pl-12 h-12"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="pl-12 pr-12 h-12"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="pl-12 h-12"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    )}

                    {!isSignUp && (
                      <div className="flex justify-end">
                        <Button variant="link" className="p-0 h-auto text-sm" disabled={isLoading}>
                          Forgot password?
                        </Button>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      variant="default" 
                      size="lg" 
                      className="w-full h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isSignUp ? 'Creating Account...' : 'Signing In...'}
                        </>
                      ) : (
                        <>
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <Separator />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                      or
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </span>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm ml-1"
                      onClick={() => setIsSignUp(!isSignUp)}
                      disabled={isLoading}
                    >
                      {isSignUp ? 'Sign in' : 'Sign up'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
