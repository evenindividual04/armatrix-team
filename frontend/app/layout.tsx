import type { Metadata } from 'next';
import { Barlow_Condensed, Barlow, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Team | Armatrix',
  description:
    'Meet the team building the future of industrial robotics — snake-like robotic arms for hazardous inspection.',
  openGraph: {
    title: 'Armatrix Team',
    description:
      "The minds behind Armatrix's snake-like robotic arms for industrial inspection.",
    siteName: 'Armatrix',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${barlow.variable} ${jetbrainsMono.variable}`}
    >
      <body
        style={{ backgroundColor: '#080A08' }}
        className="text-[#E8EBE8] antialiased"
      >
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
