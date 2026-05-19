import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata: Metadata = {
  title: "Floraria Clory's | Flowers With Heart",
  description: 'Floraria Clory\'s — buchete, aranjamente florale și cutii cu flori proaspete. Livrare rapidă în Țara Oașului. Comandă online flori proaspete cu mesaj personalizat.',
  keywords: 'florarie, tara oasului, negresti oas, buchete, trandafiri, flori, aranjamente florale, livrare flori',
  openGraph: {
    title: "Floraria Clory's | Flowers With Heart",
    description: 'Flori proaspete cu livrare rapidă în Țara Oașului. Buchete, aranjamente, cutii cu flori.',
    locale: 'ro_RO',
    type: 'website',
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Lato:wght@300;400;700;900&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-lato bg-background text-textdark">
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
