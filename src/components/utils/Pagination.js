import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemPerPage, totalRecords }) => {

    // const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
    let pageNumbers = [];
    if (totalPages <= 7) {
      pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
    } else if (currentPage <= 1) {
      pageNumbers = [1, 2, '...', totalPages - 1, totalPages];
    } else if (currentPage >= totalPages - 1) {
      pageNumbers = [1, "...", totalPages - 2, totalPages - 1, totalPages];
    } else if (currentPage === 2) {
      pageNumbers = [1, currentPage, currentPage + 1, '...',totalPages - 1, totalPages];
    } else if (currentPage === 3) {
        pageNumbers = [1,2, currentPage, currentPage + 1, '...',totalPages - 1, totalPages];
      }
    else {
      pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }

    return (
        <div>
            {/* {(totalRecords !== null && totalRecords !== undefined) &&
            <div>
              <p className="mt-2 mb-2">Showing <span className="font-weight-bold">{((currentPage - 1) * itemPerPage + 1)} to {(currentPage * itemPerPage)}</span>{" "}
               records from <span className="font-weight-bold">{totalRecords}</span>{" "}of total Records</p>
            </div>
          } */}
            <div className="flex items-center justify-between border-t bg-white px-4 py-2 sm:px-6">

                <div className=" flex flex-1 items-center justify-center sm:justify-between">
                    {/* <p className="hidden sm:block text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">97</span> results
                    </p> */}
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {pageNumbers.map((number, index) =>
                            <button key={index}
                                aria-current="page"
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${currentPage === number ? "text-white bg-black hover:bg-black ring-black" : "hover:bg-gray-50"}`}
                                onClick={() => onPageChange(number)}
                                disabled={number === "..."}
                            >
                                {number}
                            </button>
                        )}

                        <button
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
