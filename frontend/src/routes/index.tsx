import React, { Suspense } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { routes, RouteConfig } from '@/routes/RouteConfig'
import MainLayout from '@/components/layouts/MainLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import RouteErrorBoundary from '@/components/RouteErrorBoundary'
import { useAuth } from '@/contexts/authContext'
import authService from '@/services/auth.service'

interface ProtectedRouteProps {
    children?: React.ReactNode
    allowedRoles?: string[]
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const location = useLocation()
    const { isAuthenticated, currentUser, isLoading } = useAuth()

    // Check if tokens exist but we're still waiting for user data
    const hasValidTokens = authService.isAuthenticated()

    // Show loading spinner while checking authentication or if we have valid tokens but user data is still loading
    if (isLoading || (hasValidTokens && !currentUser)) {
        return <LoadingSpinner fullScreen />
    }

    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If roles are specified, check if user has required role
    if (allowedRoles && allowedRoles.length > 0 && currentUser) {
        const hasRequiredRole = allowedRoles.includes(currentUser.role)
        if (!hasRequiredRole) {
            // Redirect to unauthorized page or dashboard based on user role
            return <Navigate to="/home" state={{ from: location }} replace />
        }
    }

    return <>{children || <Outlet />}</>
}

// Check if a route is an auth route (login, register, verify-email)
const isAuthRoute = (path: string): boolean => {
    return [
        '/login',
        '/register',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
    ].some((authPath) => path === authPath || path.startsWith(`${authPath}/`))
}

const AppRoutes = () => {
    const { isLoading } = useAuth()

    // Only show loading spinner on initial auth check, not during login/register operations
    // This prevents full-page refresh during failed login attempts
    const isInitialAuthCheckOnly =
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        isLoading

    if (isInitialAuthCheckOnly) {
        return <LoadingSpinner fullScreen />
    }

    // Helper function to create route elements
    const createRouteElement = (route: RouteConfig) => (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
                <route.element />
            </Suspense>
        </ErrorBoundary>
    )

    // Filter routes into auth routes and main routes
    const authRoutes = routes.filter((route) => isAuthRoute(route.path))
    const mainRoutes = routes.filter((route) => !isAuthRoute(route.path))

    // Separate protected and public routes
    const protectedRoutes = mainRoutes.filter((route) => route.requiresAuth)
    const publicRoutes = mainRoutes.filter((route) => !route.requiresAuth)

    return (
        <Routes>
            {/* Auth routes without MainLayout */}
            {authRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={createRouteElement(route)}
                    errorElement={<RouteErrorBoundary />}
                />
            ))}

            {/* Main Layout wrapper */}
            <Route
                element={
                    <ErrorBoundary>
                        <MainLayout />
                    </ErrorBoundary>
                }
                errorElement={<RouteErrorBoundary />}
            >
                {/* Public routes within MainLayout */}
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={createRouteElement(route)}
                        errorElement={<RouteErrorBoundary />}
                    />
                ))}

                {/* Protected routes within MainLayout */}
                {protectedRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <ProtectedRoute allowedRoles={route.allowedRoles}>
                                {createRouteElement(route)}
                            </ProtectedRoute>
                        }
                        errorElement={<RouteErrorBoundary />}
                    />
                ))}
            </Route>
        </Routes>
    )
}

export default AppRoutes
