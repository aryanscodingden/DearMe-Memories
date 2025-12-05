"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <section
      className={cn(
        "bg-background text-foreground relative",
        "py-12 sm:py-24 md:py-32 px-4",
        "overflow-hidden min-h-screen flex items-center justify-center"
      )}
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-1/2 top-1/3 -translate-x-1/2" 
          style={{ 
            width: '500px', 
            height: '500px', 
            backgroundColor: '#ff6600',
            opacity: 0.4,
            borderRadius: '50%',
            filter: 'blur(150px)'
          }}
        />
        <div 
          className="absolute right-1/4 bottom-1/3"
          style={{ 
            width: '400px', 
            height: '400px', 
            backgroundColor: '#ff4400',
            opacity: 0.3,
            borderRadius: '50%',
            filter: 'blur(120px)'
          }}
        />
      </div>
      
      <div className="mx-auto flex max-w-5xl flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          <Badge variant="outline" className="animate-appear gap-2">
            <span className="text-muted-foreground">✨ Now available</span>
            <a href="/login" className="flex items-center gap-1">
              Get started
              <ArrowRight className="h-3 w-3" />
            </a>
          </Badge>

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-appear bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            Write to Your Future Self
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
            DearMe helps you preserve your thoughts, track your growth, and connect with your future self through meaningful journal entries.
          </p>

          {/* Actions */}
          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            <Button variant="glow" size="lg" asChild>
              <a href="/login" className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Start Writing
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/about" className="flex items-center gap-2">
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}