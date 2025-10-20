import React from 'react'
import {
    useRouteError,
    isRouteErrorResponse,
    useNavigate,
} from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

const RouteErrorBoundary: React.FC = () => {
    const error = useRouteError()
    const navigate = useNavigate()

    let errorMessage = 'An unexpected error occurred'
    let errorStatus = ''

    if (isRouteErrorResponse(error)) {
        errorStatus = `${error.status} ${error.statusText}`
        errorMessage = error.data?.message || errorMessage
    } else if (error instanceof Error) {
        errorMessage = error.message
    } else if (typeof error === 'string') {
        errorMessage = error
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-md shadow-lg border-border/40">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        {errorStatus ? errorStatus : 'Something went wrong'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-destructive/10 p-4 rounded-md text-sm overflow-auto max-h-64">
                        <p className="font-medium text-destructive mb-2">
                            Error:
                        </p>
                        <p className="font-mono">{errorMessage}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        onClick={() => navigate(-1)}
                        className="w-full"
                        variant="default"
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate('/', { replace: true })}
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

export default RouteErrorBoundary
