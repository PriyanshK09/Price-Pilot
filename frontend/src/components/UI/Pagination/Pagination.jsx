import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always add first page
    pageNumbers.push(1);
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always add last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // Go to previous page
  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // Go to next page
  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // If there's only one page, don't show pagination
  if (totalPages <= 1) return null;
  
  return (
    <nav aria-label="Pagination" className="pagination">
      <ul className="pagination-list">
        <li className="pagination-item">
          <button
            className="pagination-link pagination-arrow"
            onClick={goToPrevious}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft size={18} />
          </button>
        </li>
        
        {getPageNumbers().map((page, index) => (
          <li key={index} className="pagination-item">
            {page === '...' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                className={`pagination-link ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageClick(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        <li className="pagination-item">
          <button
            className="pagination-link pagination-arrow"
            onClick={goToNext}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight size={18} />
          </button>
        </li>
      </ul>
      
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

export default Pagination;