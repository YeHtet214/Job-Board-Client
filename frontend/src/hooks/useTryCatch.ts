import { useState, useCallback } from 'react'

interface UseTryCatchReturn<T> {
    execute: (...args: any[]) => Promise<T | undefined>
    error: Error | null
    isLoading: boolean
    clearError: () => void
}

/**
 * A hook that wraps async functions in try/catch blocks and provides loading and error states
 *
 * @param asyncFunction The async function to execute
 * @param onError Optional callback to handle errors
 * @returns Object containing execute function, error state, loading state, and clearError function
 */
function useTryCatch<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    onError?: (error: Error) => void
): UseTryCatchReturn<T> {
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const execute = useCallback(
        async (...args: any[]): Promise<T | undefined> => {
            try {
                setIsLoading(true)
                setError(null)
                return await asyncFunction(...args)
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error(String(err))
                setError(error)
                if (onError) {
                    onError(error)
                }
                console.error('Error in useTryCatch:', error)
                return undefined
            } finally {
                setIsLoading(false)
            }
        },
        [asyncFunction, onError]
    )

    return { execute, error, isLoading, clearError }
}

export default useTryCatch
