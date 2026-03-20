'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Camera,
  MessageSquareMore,
  BookOpen,
  GraduationCap,
  History,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/',           label: 'Home',           icon: Home },
  { href: '/camera',     label: 'Kamera Real-Time', icon: Camera },
  { href: '/twoway',     label: 'Mode Dua Arah',    icon: MessageSquareMore },
  { href: '/dictionary', label: 'Kamus BISINDO',    icon: BookOpen },
  { href: '/learn',      label: 'Modul Belajar',    icon: GraduationCap },
  { href: '/history',    label: 'Riwayat',          icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="BISINDO Logo"
            width={44}
            height={44}
            className="rounded-lg object-contain"
            priority
          />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none" style={{ color: 'var(--color-text)' }}>
            BISINDO - VISION
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Bahasa Isyarat Indonesia
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group"
              style={{
                backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon
                size={20}
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-muted)' }}
              />
              <span className="text-sm">{label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          v1.0 – Prototype
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
          PKM – Pemweb 2026
        </p>
      </div>
    </div>
  );
}
