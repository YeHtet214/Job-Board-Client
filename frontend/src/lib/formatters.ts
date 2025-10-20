// formatters.ts - Utility functions for formatting data

/**
 * Gets the first two letters of a company name as uppercase initials
 * @param companyName The company name
 * @param fallback Fallback value if company name is not available
 * @returns The company initials or fallback value
 */
export const getCompanyInitials = (
    companyName?: string,
    fallback = 'CO'
): string => {
    return companyName?.substring(0, 2).toUpperCase() || fallback
}

/**
 * Formats salary range as a string
 * @param min Minimum salary in thousands
 * @param max Maximum salary in thousands
 * @returns Formatted salary range string
 */
export const formatSalaryRange = (min: number, max: number): string => {
    return `$${min}K - $${max}K`
}

/**
 * Formats a date string into a localized date format
 * @param dateString ISO date string
 * @param options Date formatting options
 * @returns Formatted date string
 */
export const formatDate = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string => {
    return new Date(dateString).toLocaleDateString('en-US', options)
}
