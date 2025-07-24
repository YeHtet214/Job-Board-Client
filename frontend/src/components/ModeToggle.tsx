import { useTheme } from "@/components/ThemeProvider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// export function ModeToggle() {
//   const { setTheme } = useTheme()
//   const [open, setOpen] = useState(false);

//   const handleToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <div className="relative theme-toggler">
//       <Button variant="outline" size="icon" className="relative" onClick={handleToggle}>
//         <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//         <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//         <span className="sr-only">Toggle theme</span>
//       </Button>

//       { open && (
//         <ul className="absolute bottom-0 right-0 translate-y-[100%] bg-jb-surface min-w-20 shadow-lg z-100 rounded">
//           <li onClick={() => setTheme("light")} className="py-2 px-4 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary"><Sun className="h-4 w-4 mr-2" />Light</li><hr/>
//           <li onClick={() => setTheme("dark")} className="py-2 px-4 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary"><Moon className="h-4 w-4 mr-2" />Dark</li><hr/>
//         </ul>
//       )}
//     </div>
//   )
// }


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false);
  const togglerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (togglerRef.current && !togglerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={togglerRef} className="relative theme-toggler">
      <Button variant="outline" size="icon" className="relative" onClick={handleToggle}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      { open && (
        <ul className="absolute -bottom-5 left-0 lg:right-0 lg:-translate-x-[50%] translate-y-[100%] bg-jb-surface min-w-20 shadow-lg z-100 rounded">
          <li onClick={() => { setTheme("light"); setOpen(false)}} className={`py-2 px-4 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary ${theme === "light" && "text-jb-primary"}`}><Sun className="h-4 w-4 mr-2" />Light</li><hr/>
          <li onClick={() => { setTheme("dark"); setOpen(false)}} className={`py-2 px-4 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary ${theme === "dark" && "text-jb-primary"}`}><Moon className="h-4 w-4 mr-2" />Dark</li><hr/>
        </ul>
      )}
    </div>
  )
}