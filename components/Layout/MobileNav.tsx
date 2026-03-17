'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Camera,
  MessageSquareMore,
  BookOpen,
  GraduationCap,
  History,
} from 'lucide-react';

const navItems = [
  { href: '/camera', label: 'Kamera', icon: Camera },
  { href: '/twoway', label: 'Dua Arah', icon: MessageSquareMore },
  { href: '/dictionary', label: 'Kamus', icon: BookOpen },
  { href: '/learn', label: 'Belajar', icon: GraduationCap },
  { href: '/history', label: 'Riwayat', icon: History },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden flex items-center justify-around py-2 safe-area-pb"
      style={{
        backgroundColor: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-150"
            style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-muted)' }}
          >
            <div
              className="flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-150"
              style={{ backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent' }}
            >
              <Icon size={20} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
