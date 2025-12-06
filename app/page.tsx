"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link"


export default function Home() {
  return (
    <section className="flex items-center justify-center min-h-screen text-color relative overflow-hidden px-6">
      {/* Background glow effects */}
      <div 
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'rgb(234, 88, 12)' }}
      />
      <div 
        className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'rgb(234, 88, 12)' }}
      />
    
    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
    
    
    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 text-sm text-white/60 backdrop-blur-md">
      Open Source
      </div>
      <h1 className="font-[650] text-5xl md:text-7xl leading-[1.05] text-white drop-shadow-sm font-[Plus Jakarta Sans]">
        Refresh your memories <span className="opacity-75">with a mail to yourself in 5 years.</span>
      </h1>

      <h2 className="text-xl font-semibold text-white">
        Journal your day the right way.
      </h2>

      <p className="text-white/70 text-lg leading-relaxed max-x-xl mx-auto">
      DearMe redefines thoughts into a visually calming experience.
      Built for clarity, growth & flow.
      </p>

      <div className="flex justify-center gap-4 pt-4">
        <Link 
          href="/login"
          className="px-7 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>

      <Link 
        href="/about"
        className="px-7 py-3 rounded-full border border-white/25 text-white font-medium hover:bg-white/10 transition-all"
        >
          Learn More
        </Link>
      </div>
    </div>
    </section>
  );
}