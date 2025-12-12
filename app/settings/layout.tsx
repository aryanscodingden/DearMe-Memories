"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Settings, LogOut, FileText } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { label: "Journal", href: "/journal", icon: BookOpen },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen text-zinc-800 relative bg-linear-to-br from-stone-100 via-amber-50 to-orange-50">
      <aside className="w-64 border-r border-stone-200 bg-white/70 backdrop-blur-xl flex flex-col">
        <div className="p-6 space-y-10 flex-1">
          <h1 className="font-semibold text-xl text-zinc-800 tracking-tight">
            Dear<span className="text-orange-500">Me</span>
          </h1>

          <nav className="space-y-1">
            {links.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/journal" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-orange-100 text-orange-600"
                      : "text-zinc-600 hover:bg-stone-100"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6 border-t border-stone-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition text-red-500 hover:bg-red-50 w-full"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
