'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    attribute?: string
}

const ThemeContext = createContext<{
    theme: Theme
    setTheme: (theme: Theme) => void
}>({
    theme: 'system',
    setTheme: () => null,
})

export function ThemeProvider({
                                  children,
                                  defaultTheme = 'system',
                                  attribute = 'class',
                              }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within a ThemeProvider')
    return context
}