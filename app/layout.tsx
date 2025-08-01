import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context" // Import LanguageProvider
import "./globals.css"

export const metadata: Metadata = {
  title: "STRUGAL Inventory System", // This will be dynamically set by the LanguageProvider
  description: "Professional inventory management system for STRUGAL's aluminum and glass production.", // This will be dynamically set
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {" "}
            {/* Wrap children with LanguageProvider */}
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
