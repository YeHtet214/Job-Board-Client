import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
const STORAGE_KEY = 'vite-ui-theme'

type ThemeProviderProps = {
    children: React.ReactNode
}

type ThemeProviderState = {
    theme: Theme
    toggleTheme: () => void
}

const initialState: ThemeProviderState = {
    theme: localStorage.getItem(STORAGE_KEY) as Theme,
    toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(initialState.theme || 'light')

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove('light', 'dark')
        
        root.classList.add(theme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem(STORAGE_KEY, newTheme)
        setTheme(newTheme)
    }

    return (
        <ThemeProviderContext.Provider {...props} value={{ theme, toggleTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
