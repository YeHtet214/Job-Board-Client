import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function ModeToggle() {
    const { theme, toggleTheme } = useTheme()
    const [open, setOpen] = useState(false)
    const togglerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function handleClickOutside(event: MouseEvent) {
            if (
                togglerRef.current &&
                !togglerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open, theme])

    return (
        <Button
            variant="outline"
            size="icon"
            className="relative focus:rotate-180"
            onClick={() => toggleTheme()}
        >
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-100" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all dark:rotate-0 dark:scale-0" />
        </Button>
        
    )
}
