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
        <div className="healthcare-bg"></div>
        {/* Floating Icons */}
        <div className="floating-icon"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg></div>
        <div className="floating-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
        <div className="floating-icon"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg></div>
        <div className="floating-icon"><svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 19 12l-8.5-8.5" /><path d="M14 8.5 5.5 17l8.5 8.5" /></svg></div>
        <div className="floating-icon"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg></div>

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