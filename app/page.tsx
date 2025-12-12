"use client";

import { ArrowRight, Sparkles, Clock, Heart, BookOpen } from "lucide-react";
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-stone-100 overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">

        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl opacity-50" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        

          <h1 className="text-5xl md:text-7xl font-bold text-zinc-800 leading-tight tracking-tight">
            Your thoughts,
            <br />
            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              delivered tomorrow.
            </span>
          </h1>


          <p className="text-xl md:text-2xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            DearMe is a beautiful journal app that lets you capture today's moments 
            and rediscover them in the future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link 
              href="/login"
              className="px-8 py-4 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2"
            >
              Start Writing <ArrowRight className="h-5 w-5" />
            </Link>

            <Link 
              href="/about"
              className="px-8 py-4 rounded-full bg-white border border-stone-200 text-zinc-700 font-semibold hover:bg-stone-50 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-zinc-800 mb-16">
            Why DearMe?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">Time Capsule</h3>
              <p className="text-zinc-600">
                Write letters to yourself and schedule them to arrive days, months, or years from now.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">Beautiful Journal</h3>
              <p className="text-zinc-600">
                A distraction-free writing experience designed for reflection and clarity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">Memory Lane</h3>
              <p className="text-zinc-600">
                Revisit your past thoughts and see how much you've grown over time.
              </p>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
        </div>
      </section>

  
      <footer className="py-8 px-6 border-t border-stone-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2025 DearMe. Made with ❤️ for dreamers.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/about" className="hover:text-zinc-800 transition">About</Link>
            <Link href="/privacy" className="hover:text-zinc-800 transition">Privacy</Link>
            <a href="https://github.com/aryanscodingden/DearMe-Memories" target="_blank" className="hover:text-zinc-800 transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}