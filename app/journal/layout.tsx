"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {Book, BookOpen, PlusCircle, Settings} from "lucide-react";

export default function JournalLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const menu = [
    {name: "Journal", icon: BookOpen, href: "/journal"},
    {name: "New Entry", icon: PlusCircle, href: "/journal/new"},
    {name: "Settings", icon: Settings, href: "/settings"},
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 backdrop-blur-md bg-white/5 border-r border-border p-6 flex flex-col gap-8">
        <h1 className="text-xl font-semibold tracking-tight">DearMe</h1>

        <nav className="space-y-1">
          {menu.map(item => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${active ? "bg-accent/20 text-accent" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon className="w-4 h-4"/>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto text-xs text-white/40">
          Logged in
        </div>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  )
}