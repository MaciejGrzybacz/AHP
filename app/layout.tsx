'use client'

import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/globals.css"

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pl" suppressHydrationWarning>
        <head>
            <title>AHP Calculator</title>
        </head>
        <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}