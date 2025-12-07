"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {Book, BookOpen, PlusCircle, Settings} from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";

export default function JournalLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const menu = [
    {name: "Journal", icon: BookOpen, href: "/journal"},
    {name: "New Entry", icon: PlusCircle, href: "/journal/new"},
    {name: "Settings", icon: Settings, href: "/settings"},
  ];

  return (
    <div className="flex min-h-screen text-zinc-800 relative bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50">
      {/* Warm light paper-like background */}
      
      <aside className="w-64 backdrop-blur-sm bg-white/60 border-r border-stone-200 p-6 flex flex-col gap-8 relative z-10">
        <h1 className="text-xl font-semibold tracking-tight">DearMe</h1>

        <nav className="space-y-1">
          {menu.map(item => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${active ? "bg-orange-100 text-orange-600" : "text-zinc-600 hover:bg-stone-100 hover:text-zinc-800"}`}
              >
                <Icon className="w-4 h-4"/>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto text-xs text-zinc-400">
          Logged in
        </div>
      </aside>

      <div className="flex-1 relative z-10">{children}</div>
    </div>
  )
}