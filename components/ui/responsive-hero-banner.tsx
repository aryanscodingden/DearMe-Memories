"use client";

import React, { useState } from 'react';

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface ResponsiveHeroBannerProps {
    logoText?: string;
    backgroundImageUrl?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    logoText = "DearMe",
    backgroundImageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&h=1200&fit=crop",
    navLinks = [
        { label: "Home", href: "/", isActive: true },
        { label: "Journal", href: "/journal" },
        { label: "Reports", href: "/reports" },
    ],
    ctaButtonText = "Get Started",
    ctaButtonHref = "/login",
    badgeLabel = "New",
    badgeText = "Track your growth with AI-powered insights",
    title = "Write to Your",
    titleLine2 = "Future Self",
    description = "DearMe helps you preserve your thoughts, track your growth, and connect with your future self through meaningful journal entries.",
    primaryButtonText = "Start Writing",
    primaryButtonHref = "/login",
    secondaryButtonText = "Learn More",
    secondaryButtonHref = "#features",
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative">
            <img
                src={backgroundImageUrl}
                alt=""
                className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

            <header className="z-10 relative">
                <div className="mx-6">
                    <div className="flex items-center justify-between pt-6">
                        <a
                            href="/"
                            className="text-2xl font-bold text-white"
                        >
                            {logoText}
                        </a>

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`px-3 py-2 text-sm font-medium hover:text-white transition-colors ${link.isActive ? 'text-white/90' : 'text-white/80'
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href={ctaButtonHref}
                                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 transition-colors"
                                >
                                    {ctaButtonText}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M7 7h10v10" />
                                        <path d="M7 17 17 7" />
                                    </svg>
                                </a>
                            </div>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                <path d="M4 5h16" />
                                <path d="M4 12h16" />
                                <path d="M4 19h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="md:hidden z-20 fixed inset-0 bg-black/95 backdrop-blur-lg">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-6">
                            <a href="/" className="text-2xl font-bold text-white">
                                {logoText}
                            </a>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
                                aria-label="Close menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex flex-col gap-2 p-6">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-lg font-medium text-white/80 hover:text-white py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href={ctaButtonHref}
                                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-white/90"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {ctaButtonText}
                            </a>
                        </nav>
                    </div>
                </div>
            )}

            <div className="z-10 relative">
                <div className="max-w-7xl mx-auto pt-32 md:pt-40 px-6 pb-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-in">
                            <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2">
                                {badgeLabel}
                            </span>
                            <span className="text-sm font-medium text-white/90">
                                {badgeText}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-white tracking-tight font-bold animate-fade-in-delay-1">
                            {title}
                            <br />
                            {titleLine2}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mt-6 mx-auto leading-relaxed animate-fade-in-delay-2">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-in-delay-3">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center gap-2 hover:bg-white text-sm font-semibold text-neutral-900 bg-white/95 rounded-full py-3 px-6 transition-all hover:shadow-xl"
                            >
                                {primaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all"
                            >
                                {secondaryButtonText}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
