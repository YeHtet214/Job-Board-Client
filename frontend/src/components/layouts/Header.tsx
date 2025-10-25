import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import {
    LogOut,
    Home,
    Briefcase,
    Building,
    User,
    Menu,
    LogIn,
    UserRoundPlus,
} from 'lucide-react'
import { ModeToggle } from '../ModeToggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import NotificationItems from '../notifications'

const Header: React.FC = () => {
    const { currentUser, logout, isAuthenticated, isLoading } = useAuth()
    const [isActivePage, setIsActivePage] = useState<string>('')
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setIsActivePage(location.pathname.split('/')[1])
    }, [location])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const linkBaseClasses =
        'flex items-center gap-1 text-sm font-medium transition-colors rounded-md px-3 py-2'
    const activeLinkClasses = '!text-jb-primary bg-jb-highlight !font-semibold'

    return (
        <header className="border-b bg-jb-bg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-jb-primary z-10 flex items-center"
                    >
                        <img
                            src="https://i.ibb.co/1tMWrFJB/jb-logo-tran.png"
                            alt="logo"
                            width="70"
                        />
                        <span className="ml-2">JobBoard</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link
                                    to="/"
                                    className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === '' ? activeLinkClasses : ''}`}
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link
                                    to="/jobs"
                                    className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'jobs' ? activeLinkClasses : ''}`}
                                >
                                    <Briefcase className="h-4 w-4" />
                                    Jobs
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link
                                    to="/companies"
                                    className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'companies' ? activeLinkClasses : ''}`}
                                >
                                    <Building className="h-4 w-4" />
                                    Companies
                                </Link>
                            </NavigationMenuItem>

                            {!isLoading && isAuthenticated && (
                                <>
                                    <NavigationMenuItem>
                                        <Link
                                            to="/dashboard"
                                            className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'dashboard' ? activeLinkClasses : ''}`}
                                        >
                                            <User className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </NavigationMenuItem>

                                    {currentUser?.role === 'EMPLOYER' && (
                                        <NavigationMenuItem>
                                            <Link
                                                to="/company/:id/profile"
                                                className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'company' ? activeLinkClasses : ''}`}
                                            >
                                                <Building className="h-4 w-4" />
                                                Company Profile
                                            </Link>
                                        </NavigationMenuItem>
                                    )}

                                    {currentUser?.role === 'JOBSEEKER' && (
                                        <NavigationMenuItem>
                                            <Link
                                                to="/profile/:id"
                                                className={`${navigationMenuTriggerStyle()} ${linkBaseClasses} ${isActivePage === 'profile' ? activeLinkClasses : ''}`}
                                            >
                                                <User className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        </NavigationMenuItem>
                                    )}

                                    <NavigationMenuItem>
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Button>
                                    </NavigationMenuItem>
                                </>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <NotificationItems />

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isLoading && !isAuthenticated && (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium transition-colors hover:text-jb-primary"
                                >
                                    Login
                                </Link>
                                <Button asChild>
                                    <Link to="/register">Register</Link>
                                </Button>
                            </>
                        )}
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[300px] sm:w-[400px]"
                        >
                            <nav className="flex flex-col gap-4 mt-6">
                                {[
                                    {
                                        path: '/',
                                        icon: <Home className="h-4 w-4" />,
                                        label: 'Home',
                                    },
                                    {
                                        path: '/jobs',
                                        icon: <Briefcase className="h-4 w-4" />,
                                        label: 'Jobs',
                                    },
                                    {
                                        path: '/companies',
                                        icon: <Building className="h-4 w-4" />,
                                        label: 'Companies',
                                    },
                                ].map(({ path, icon, label }) => {
                                    const page = path.split('/')[1]
                                    return (
                                        <Link
                                            key={label}
                                            to={path}
                                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                isActivePage === page
                                                    ? 'text-jb-primary bg-jb-highlight font-semibold'
                                                    : 'hover:text-jb-primary'
                                            }`}
                                        >
                                            {icon}
                                            {label}
                                        </Link>
                                    )
                                })}

                                {!isLoading && isAuthenticated && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                isActivePage === 'dashboard'
                                                    ? 'text-jb-primary bg-jb-highlight font-semibold'
                                                    : 'hover:text-jb-primary'
                                            }`}
                                        >
                                            <User className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        {currentUser?.role === 'EMPLOYER' && (
                                            <Link
                                                to="/company/profile"
                                                className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                    isActivePage === 'company'
                                                        ? 'text-jb-primary bg-jb-highlight font-semibold'
                                                        : 'hover:text-jb-primary'
                                                }`}
                                            >
                                                <Building className="h-4 w-4" />
                                                Company Profile
                                            </Link>
                                        )}
                                        {currentUser?.role !== 'EMPLOYER' && (
                                            <Link
                                                to="/profile"
                                                className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                    isActivePage === 'profile'
                                                        ? 'text-jb-primary bg-jb-highlight font-semibold'
                                                        : 'hover:text-jb-primary'
                                                }`}
                                            >
                                                <User className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        )}
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 justify-start px-3 py-2 text-sm font-medium"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Button>
                                    </>
                                )}

                                {!isLoading && !isAuthenticated && (
                                    // <div className="flex flex-col gap-3 mt-2">
                                    // </div>
                                    <>
                                        <Link
                                            to="/login"
                                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                isActivePage === 'company'
                                                    ? 'text-jb-primary bg-jb-highlight font-semibold'
                                                    : 'hover:text-jb-primary'
                                            }`}
                                        >
                                            <LogIn className="h-4 w-4" />
                                            Login
                                        </Link>

                                        {/* <Button asChild> */}
                                        <Link
                                            to="/register"
                                            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                isActivePage === 'company'
                                                    ? 'text-jb-primary bg-jb-highlight font-semibold'
                                                    : 'hover:text-jb-primary'
                                            }`}
                                        >
                                            <UserRoundPlus className="h-4 w-4" />
                                            Register
                                        </Link>
                                        {/* </Button> */}
                                    </>
                                )}

                                <div className="mt-2 ml-2 relative">
                                    <ModeToggle />
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Header
