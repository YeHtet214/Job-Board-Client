import ReactPaginate from 'react-paginate'

type PaginationProps = {
    handlePageChange: (event: { selected: number }) => void;
    totalPages: number
}

const Pagination = ({ handlePageChange, totalPages }: PaginationProps ) => {

    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageChange}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="flex items-center justify-center gap-1 mt-8"
            pageClassName="inline-block"
            pageLinkClassName="flex items-center justify-center w-9 h-9 rounded-md border border-border bg-jb-surface text-jb-text hover:bg-jb-primary hover:text-foreground hover:border-jb-primary transition-all duration-200 cursor-pointer"
            activeClassName="[&>a]:bg-jb-primary [&>a]:text-white [&>a]:border-jb-primary [&>a]:font-semibold"
            previousClassName="inline-block"
            previousLinkClassName="flex items-center justify-center w-9 h-9 rounded-md border border-border bg-jb-surface text-jb-text hover:bg-jb-primary hover:text-white hover:border-jb-primary transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-jb-surface disabled:hover:text-jb-text disabled:hover:border-border"
            nextClassName="inline-block"
            nextLinkClassName="flex items-center justify-center w-9 h-9 rounded-md border border-border bg-jb-surface text-jb-text hover:bg-jb-primary hover:text-white hover:border-jb-primary transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-jb-surface disabled:hover:text-jb-text disabled:hover:border-border"
            breakClassName="inline-block"
            breakLinkClassName="flex items-center justify-center w-9 h-9 text-jb-text-muted"
            disabledClassName="opacity-50 cursor-not-allowed"
            disabledLinkClassName="cursor-not-allowed hover:bg-jb-surface hover:text-jb-text hover:border-border"
        />
    )
}

export default Pagination
