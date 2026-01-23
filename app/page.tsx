"use client";

import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";

export default function Home() {
  return (
    <ResponsiveHeroBanner
      logoText="DearMe"
      badgeLabel="New"
      badgeText="Track your growth with AI-powered insights"
      title="Write to Your"
      titleLine2="Future Self"
      description="DearMe helps you preserve your thoughts, track your growth, and connect with your future self through meaningful journal entries."
      primaryButtonText="Start Writing"
      primaryButtonHref="/login"
      secondaryButtonText="Learn More"
      secondaryButtonHref="#features"
      ctaButtonText="Get Started"
      backgroundImageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&h=1200&fit=crop&q=80"
      navLinks={[
        { label: "Home", href: "/", isActive: true },
        { label: "Journal", href: "/journal" },
        { label: "Reports", href: "/reports" },
      ]}
    />
  );
}