'use client';

import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar – visible on desktop (lg+) */}
      <aside
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30"
        style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--color-card)', borderRight: '1px solid var(--color-border)' }}
      >
        <Sidebar />
      </aside>

      {/* Main content area */}
      <main
        className="flex-1 flex flex-col min-h-screen lg:pl-64"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className="flex-1 p-4 md:p-6 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
