import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/Layout/AppLayout';

export const metadata: Metadata = {
  title: 'SIBI-VISION – Penerjemah BISINDO',
  description:
    'Platform penerjemah Bahasa Isyarat Indonesia (BISINDO) real-time yang inklusif dan mudah digunakan.',
  keywords: ['bisindo', 'bahasa isyarat', 'tunarungu', 'terjemah', 'sibi'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
