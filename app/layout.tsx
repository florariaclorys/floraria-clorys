import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'
import PublicLayout from '@/components/layout/PublicLayout'
import CursorSparkles from '@/components/ui/CursorSparkles'
import ScrollProgress from '@/components/ui/ScrollProgress'
import CursorCustom from '@/components/ui/CursorCustom'

export const metadata: Metadata = {
  metadataBase: new URL('https://myclorys.com'),
  title: {
    default: "Floraria Clory's | Flori Proaspete Negrești-Oaș",
    template: "%s | Floraria Clory's",
  },
  description: 'Floraria Clory\'s din Negrești-Oaș — buchete, aranjamente florale și cutii cu flori proaspete. Livrare 1-3 ore în Țara Oașului. Comandă online cu mesaj personalizat și plată ramburs.',
  keywords: [
    'florarie negresti oas', 'florarie tara oasului', 'flori negresti oas',
    'buchete flori oas', 'aranjamente florale negresti', 'livrare flori oas',
    'florarie online oas', 'buchete trandafiri', 'cutii flori', 'flori proaspete',
    'Clory\'s florarie', 'myclorys',
  ],
  authors: [{ name: "Floraria Clory's", url: 'https://myclorys.com' }],
  creator: "Floraria Clory's",
  openGraph: {
    title: "Floraria Clory's | Flori Proaspete Negrești-Oaș",
    description: 'Buchete, aranjamente și cutii cu flori proaspete. Livrare 1-3 ore în Țara Oașului. Comandă online!',
    url: 'https://myclorys.com',
    siteName: "Floraria Clory's",
    locale: 'ro_RO',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Floraria Clory's — Flori Proaspete Negrești-Oaș",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Floraria Clory's | Flori Proaspete Negrești-Oaș",
    description: 'Buchete, aranjamente și cutii cu flori. Livrare rapidă în Țara Oașului.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'PUNE_CODUL_TAU_AICI', // îl adaugi după verificare în Search Console
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Lato:wght@200;300;400;700;900&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-lato bg-background text-textdark">
        {/* Custom cursor elements */}
        <div id="clorys-cursor" />
        <div id="clorys-cursor-ring" />
        <ScrollProgress />
        <CursorSparkles />
        <CursorCustom />
        <CartProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Lato, sans-serif',
                fontSize: '14px',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
