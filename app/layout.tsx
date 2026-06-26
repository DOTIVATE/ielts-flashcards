import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'IELTS Flashcards - Master Vocabulary',
  description: 'Master high-yield IELTS Academic vocabulary with interactive spaced-repetition flashcards.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IELTSCards',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#4f8ef7',
          colorBackground: '#1e1e38',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any}
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-[#1a1a2e] text-slate-100 min-h-screen antialiased flex flex-col`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
