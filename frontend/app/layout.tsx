import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { RouteToasts } from '@/components/route-toasts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EventHub - Discover & Book Amazing Events',
  description: 'Your premier destination for discovering and booking events. From concerts to conferences, find your next experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToasterProvider />
          <RouteToasts />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
