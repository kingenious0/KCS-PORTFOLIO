
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const delta = 1; // Number of pages to show around current page

        for (let i = 1; i <= totalPages; i++) {
            // Always show first, last, current, and neighbors
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(
                    <Button
                        key={i}
                        variant={currentPage === i ? "neon" : "ghost"}
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className={cn("w-10 h-10 p-0 font-mono", currentPage !== i && "text-gray-400 hover:text-white")}
                    >
                        {i}
                    </Button>
                );
            } else if (
                (i === currentPage - delta - 1 && i > 1) ||
                (i === currentPage + delta + 1 && i < totalPages)
            ) {
                pages.push(
                    <div key={`ellipsis-${i}`} className="flex items-center justify-center w-10 h-10 text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </div>
                );
            }
        }
        return pages;
    };

    return (
        <div className={cn("flex items-center justify-center gap-2 mt-12", className)}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-gray-400 hover:text-white disabled:opacity-30"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Prev</span>
            </Button>

            <div className="flex items-center gap-1">
                {renderPageNumbers()}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="text-gray-400 hover:text-white disabled:opacity-30"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
        </div>
    );
}
