import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from '@/contexts/AuthContext'
import HelpButton from '@/components/HelpButton'
import { CartProvider } from '@/contexts/CartContext'
import VerificationBanner from '@/components/VerificationBanner'

const inter = Inter({ subsets: ["latin"] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  title: "UpcharSaathi",
  description: "AI-powered symptom checker and doctor recommendation system",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta name="renderer" content="webkit" />
        <meta name="force-rendering" content="webkit" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      </head>
      <body className={`${inter.className} overflow-x-hidden bg-light`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
          <AuthProvider>
            <CartProvider>
              <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <VerificationBanner />
                <main className="flex-grow-1">
                  {children}
                </main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <HelpButton />
      </body>
    </html>
  )
}