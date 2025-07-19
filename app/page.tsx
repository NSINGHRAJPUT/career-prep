import CareerGrid from "@/components/CareerGrid"
import HeroSection from "@/components/HeroSection"
import Navigation from "@/components/Navigation"
import { Sparkles, Zap, Star, Heart, Rocket, Globe } from "lucide-react"

export default function Home() {
  
  return (
     <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CareerGrid />
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: "Custom Gradients",
    description: "Beautiful gradient backgrounds that adapt to light and dark themes seamlessly.",
  },
  {
    icon: Star,
    title: "Enhanced Shadows",
    description: "Sophisticated shadow system with soft, medium, large, and glow variants.",
  },
  {
    icon: Heart,
    title: "Smooth Animations",
    description: "Carefully crafted animations with custom timing functions for delightful interactions.",
  },
  {
    icon: Rocket,
    title: "Primary Glow",
    description: "Special glow color variant for creating eye-catching accent elements.",
  },
  {
    icon: Globe,
    title: "Sidebar Support",
    description: "Complete sidebar color system for building complex application layouts.",
  },
  {
    icon: Sparkles,
    title: "Custom Transitions",
    description: "Smooth and bounce transition timing functions for enhanced user experience.",
  },
]
