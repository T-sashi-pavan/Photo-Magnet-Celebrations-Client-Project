import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Photo Magnet Celebrations - Admin Panel',
  description: 'Admin dashboard for managing orders and stock',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
