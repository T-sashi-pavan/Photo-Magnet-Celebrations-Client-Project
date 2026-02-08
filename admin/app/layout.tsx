import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Photo Magnet Celebrations - Admin Panel',
  description: 'Admin dashboard for managing orders and stock',
  icons: {
    icon: '/icon.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      <body className="bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
