import React, { useState } from 'react'
import { Button } from './ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card'
import useTryCatch from '../hooks/useTryCatch'

// Function that will throw an error
const throwError = async (): Promise<string> => {
    throw new Error('This is a test error')
}

// Function that will not throw an error
const noError = async (): Promise<string> => {
    return 'Success!'
}

const ErrorTest: React.FC = () => {
    const [result, setResult] = useState<string | null>(null)

    // Using our custom hook to handle errors
    const {
        execute: executeWithError,
        error,
        isLoading: errorLoading,
        clearError,
    } = useTryCatch(throwError)

    const { execute: executeWithoutError, isLoading: successLoading } =
        useTryCatch(noError)

    const handleThrowError = async () => {
        await executeWithError()
    }

    const handleSuccess = async () => {
        const result = await executeWithoutError()
        if (result) {
            setResult(result)
        }
    }

    // This will cause a render error
    const handleRenderError = () => {
        // @ts-ignore - Intentionally causing an error
        let obj = null as any
        obj.nonExistentMethod()
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-border/40">
            <CardHeader>
                <CardTitle>Error Boundary Test</CardTitle>
                <CardDescription>
                    Test the error boundary by triggering different types of
                    errors
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                        <p className="font-medium">
                            Error caught by useTryCatch:
                        </p>
                        <p>{error.message}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearError}
                            className="mt-2"
                        >
                            Clear Error
                        </Button>
                    </div>
                )}

                {result && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
                        <p className="font-medium">Success:</p>
                        <p>{result}</p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
                <Button
                    onClick={handleThrowError}
                    variant="destructive"
                    disabled={errorLoading}
                    className="w-full"
                >
                    {errorLoading ? 'Loading...' : 'Trigger Async Error'}
                </Button>

                <Button
                    onClick={handleRenderError}
                    variant="destructive"
                    className="w-full"
                >
                    Trigger Render Error
                </Button>

                <Button
                    onClick={handleSuccess}
                    disabled={successLoading}
                    className="w-full"
                >
                    {successLoading ? 'Loading...' : 'Trigger Success'}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ErrorTest
