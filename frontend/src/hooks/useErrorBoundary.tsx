import React, { useState, useCallback } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card'

interface ErrorFallbackProps {
    error: Error
    resetErrorBoundary: () => void
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    resetErrorBoundary,
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-md shadow-lg border-border/40">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Something went wrong
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-destructive/10 p-4 rounded-md text-sm overflow-auto max-h-64">
                        <p className="font-medium text-destructive mb-2">
                            Error:
                        </p>
                        <p className="font-mono">{error.message}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        onClick={resetErrorBoundary}
                        className="w-full"
                        variant="default"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => (window.location.href = '/')}
                        className="w-full"
                        variant="outline"
                    >
                        Go to Home Page
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export function useErrorBoundary() {
    const [error, setError] = useState<Error | null>(null)

    const resetErrorBoundary = useCallback(() => {
        setError(null)
    }, [])

    const ErrorFallback = useCallback(
        ({ error }: { error: Error }) => (
            <DefaultErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
            />
        ),
        [resetErrorBoundary]
    )

    return {
        error,
        setError,
        resetErrorBoundary,
        ErrorFallback,
    }
}

export default useErrorBoundary
