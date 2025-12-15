import { Suspense } from "react";
import { Inter } from "next/font/google"
import { StackProvider } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from '@/contexts/AuthContext'
import HelpButton from '@/components/HelpButton'
import { CartProvider } from '@/contexts/CartContext'
import VerificationBanner from '@/components/VerificationBanner'
import { TooltipProvider } from "@radix-ui/react-tooltip";


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
  generator: 'v0.dev',
  icons: {
    icon: '/assets/logos/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta name="renderer" content="webkit" />
        <meta name="force-rendering" content="webkit" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="healthcare-bg"></div>


        <StackProvider app={stackClientApp}>
          <TooltipProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
              <Suspense fallback={<div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>}>
                <AuthProvider>
                  <CartProvider>
                    <div className="d-flex flex-column min-vh-100 position-relative">
                      <Navbar />
                      <VerificationBanner />
                      <main className="flex-grow-1 d-flex flex-column">
                        {children}
                      </main>
                      <Footer />
                    </div>
                  </CartProvider>
                </AuthProvider>
              </Suspense>
            </ThemeProvider>
            <HelpButton />
          </TooltipProvider>
        </StackProvider></body>
    </html>
  )
}