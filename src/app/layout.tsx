import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { site } from '@/content/site';
import { MotionProvider } from '@/providers/MotionProvider';
import { SkipLink } from '@/components/layout/SkipLink';
import { Nav } from '@/components/layout/Nav';
import { CursorLens } from '@/components/layout/CursorLens';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
// Section headings only: a grotesk headline with serif italic accent words.
const grotesk = Space_Grotesk({ subsets: ['latin'], weight: '700', variable: '--font-grotesk' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument' });

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
      className={`${inter.variable} ${jetbrains.variable} ${grotesk.variable} ${serif.variable}`}
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
        <CursorLens />
      </body>
    </html>
  );
}
