"use client";

import { HeroSection } from "@/components/ui/hero-section";
import { Icons } from "@/components/ui/icons";
import { ArrowRight } from "lucide-react";

export default function HeroDemo() {
  return (
    <HeroSection
      badge={{
        text: "✨ Now available",
        action: {
          text: "Get started",
          href: "/login",
        },
      }}
      title="Write to Your Future Self"
      description="DearMe helps you preserve your thoughts, track your growth, and connect with your future self through meaningful journal entries."
      actions={[
        {
          text: "Start Writing",
          href: "/login",
          variant: "glow",
          icon: <ArrowRight className="h-5 w-5" />,
        },
        {
          text: "Learn More",
          href: "/about",
          variant: "outline",
        },
      ]}
      image={{
        light: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop",
        dark: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=800&fit=crop",
        alt: "DearMe Journal App Preview",
      }}
    />
  );
}
