export const getCompanyInitials = (
    companyName?: string,
    fallback = 'CO'
): string => {
    return companyName?.substring(0, 2).toUpperCase() || fallback
}

export const formatSalaryRange = (min: number, max: number): string => {
    return `$${min}K - $${max}K`
}

export const formatDate = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString
        }
        return date.toLocaleDateString('en-US', options)
    } catch (error) {
        return dateString
    }
}

export const formatAPIEnum = (value: string) => {
    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}