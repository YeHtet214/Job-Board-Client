export const isValidDate = (value: string) => {
    if (!value) return false
    const date = new Date(value)
    return !isNaN(date.getTime())
}

// Helper to ensure dates are not in the future
export const isNotInFuture = (value: string) => {
    if (!value) return true
    const date = new Date(value)
    return date <= new Date()
}

// Helper to check if start date is before end date
export const isBeforeEndDate = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return true
    return new Date(startDate) <= new Date(endDate)
}
