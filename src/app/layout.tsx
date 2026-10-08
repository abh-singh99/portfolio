import type { Metadata, Viewport } from 'next';
import { Albert_Sans, Geist, JetBrains_Mono } from 'next/font/google';
import { site } from '@/content/site';
import { MotionProvider } from '@/providers/MotionProvider';
import { SkipLink } from '@/components/layout/SkipLink';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const albert = Albert_Sans({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-albert',
});
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}, ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
};

// Runs before paint so a saved light preference never flashes dark first.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${albert.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SkipLink />
        <MotionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
