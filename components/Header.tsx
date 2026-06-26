'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { BookOpen, GraduationCap, LayoutDashboard, Library } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/study', label: 'Study', icon: GraduationCap },
    { href: '/words', label: 'Word List', icon: Library },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2a4a] bg-[#1a1a2e]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-white">
          <BookOpen className="w-6 h-6 text-[#4f8ef7]" />
          <span>IELTS <span className="text-[#4f8ef7]">Flashcards</span></span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#4f8ef7] bg-[#4f8ef7]/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <div className="pl-2 border-l border-[#2a2a4a] flex items-center">
            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
