"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {cn} from "@/lib/utils";
import {Home, BookOpen, PlusCircle, Settings, PlusSquare} from 'lucide-react';

export default function JournalLayout({children}: {children: React.ReactNode}) {
    const pathname = usePathname();

    const menu = [
        {label: "Journal", href: "/journal", icon: BookOpen},
        {label: "New Entry", href: "/journal/new", icon: PlusCircle},
        {label: "Settings", href: "/settings", icon: Settings}
    ];

    return (
        <div className="flex min-h-screen bg-linear-to-br from-black to-zinc-900 text-white">
            <nav className="w-56 border-r border-white/10 px-6 py-8">
                <h1 className="text-xl font-semibold mb-8">DearMe</h1>

                <ul className="space-y-2">
                    {menu.map(item => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);
                        return (
                            <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                                    active
                                    ? "bg-white/10 text-orange-300"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className="w-4 h-4"/>
                                {item.label}
                            </Link> 
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="flex-1 flex overflow-hidden">
                    {children}
            </div>
        </div>
    )
} 