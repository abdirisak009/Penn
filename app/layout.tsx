import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/custom-cursor.css" // Import the custom cursor CSS
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor" // Import the custom cursor component
import { CommunityPopup } from "@/components/community-popup" // Import the community popup component
import { ScrollToTop } from "@/components/scroll-to-top" // Import the scroll to top component
import { WelcomePopup } from "@/components/welcome-popup" // Import the welcome popup component
import { Chatbot } from "@/components/chatbot" // Import the Chatbot component
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Penn Creative Lab - Bridging Learning and Skills",
  description:
    "An innovative educational and technology hub offering online learning, in-person training, and technology services.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white dark:bg-[#122C39] text-[#122C39] dark:text-white`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <ScrollToTop /> {/* Add the ScrollToTop component */}
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CustomCursor /> {/* Add the custom cursor component */}
              <CommunityPopup /> {/* Add the community popup component */}
              <WelcomePopup /> {/* Add the welcome popup component */}
              <Chatbot /> {/* Add the Chatbot component */}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
