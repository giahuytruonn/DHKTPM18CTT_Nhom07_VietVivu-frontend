// src/components/tours/PaginationControls.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<Props> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null; 
    }

    return (
        <div className="flex items-center justify-between mt-8">
          
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Trang trước
            </button>

          
            <span className="text-sm font-medium text-gray-700">
                Trang <span className="font-bold text-indigo-600">{currentPage}</span> /{" "}
                <span className="font-bold">{totalPages}</span>
            </span>

         
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Trang sau
                <ChevronRight className="w-5 h-5 ml-1" />
            </button>
        </div>
    );
};

export default PaginationControls;