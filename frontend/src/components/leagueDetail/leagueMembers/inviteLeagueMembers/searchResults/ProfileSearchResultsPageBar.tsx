import React from "react";
import { Pagination } from "../../../../../services/profile/profileService";


interface ProfileSearchResultsPageBarProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
}

const ProfileSearchResultsPageBar: React.FC<ProfileSearchResultsPageBarProps> = ({ pagination, onPageChange }) => {
    const { currentPage, totalPages } = pagination;

    // Handler for previous and next buttons
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            {/* Previous Button */}
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            >
                &lt;
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${page === currentPage
                        ? "bg-blue-500 text-white cursor-default"
                        : "bg-white text-blue-500 hover:bg-blue-100"
                        }`}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            >
                &gt;
            </button>
        </div>
    );
}

export default ProfileSearchResultsPageBar;