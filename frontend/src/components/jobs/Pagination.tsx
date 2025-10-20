import React from 'react'
import { useJobsData } from '@/hooks/react-queries/job'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination: React.FC = () => {
    const { currentPage, totalPages, handlePageChange, totalCount } =
        useJobsData()

    // If there's only one page or no results, don't show pagination
    if (totalPages <= 1 || totalCount === 0) {
        return null
    }

    // Create an array of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5 // Maximum number of page buttons to show

        if (totalPages <= maxPagesToShow) {
            // If we have fewer pages than our maximum, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always include first page
            pageNumbers.push(1)

            // Calculate start and end of the middle section
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = 4
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pageNumbers.push('ellipsis-start')
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('ellipsis-end')
            }

            // Always include last page
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    const pageNumbers = getPageNumbers()

    return (
        <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageNumbers.map((pageNumber, index) => {
                    if (
                        pageNumber === 'ellipsis-start' ||
                        pageNumber === 'ellipsis-end'
                    ) {
                        return (
                            <span
                                key={`${pageNumber}-${index}`}
                                className="px-3 py-2"
                            >
                                ...
                            </span>
                        )
                    }

                    return (
                        <Button
                            key={pageNumber}
                            variant={
                                currentPage === pageNumber
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => handlePageChange(Number(pageNumber))}
                            className={`h-9 w-9 p-0 ${
                                currentPage === pageNumber
                                    ? 'bg-jobboard-purple hover:bg-jobboard-purple/90 text-white'
                                    : 'text-jobboard-darkblue hover:bg-jobboard-light'
                            }`}
                            aria-label={`Page ${pageNumber}`}
                            aria-current={
                                currentPage === pageNumber ? 'page' : undefined
                            }
                        >
                            {pageNumber}
                        </Button>
                    )
                })}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </nav>
        </div>
    )
}

export default Pagination
