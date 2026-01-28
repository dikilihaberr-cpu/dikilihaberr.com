import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import ToastContainer from '@/components/ui/Toast'
import ErrorBoundary from '@/components/ErrorBoundary'
import AbortErrorHandler from '@/components/AbortErrorHandler'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DikiliHaber - Güncel Haberler',
  description: 'Dikili\'nin en güncel haberleri için DikiliHaber\'ı takip edin.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} ${montserrat.className}`}>
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </AuthProvider>
        </ErrorBoundary>
        <AbortErrorHandler />
      </body>
    </html>
  )
}