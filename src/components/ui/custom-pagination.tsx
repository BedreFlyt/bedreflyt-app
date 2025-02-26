import React, { JSX } from 'react';
import { Pagination } from 'react-bootstrap';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  maxPagesToShow?: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow = 5
}) => {
  const renderPaginationItems = () => {
    const pageNumbers: JSX.Element[] = [];
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfMaxPagesToShow);

    if (currentPage <= halfMaxPagesToShow) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + halfMaxPagesToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(<Pagination.Ellipsis key="start-ellipsis" />);
      pageNumbers.unshift(
        <Pagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" />);
      pageNumbers.push(
        <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      {renderPaginationItems()}
      <Pagination.Next 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
      <Pagination.Last 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages} 
      />
    </Pagination>
  );
};

export default CustomPagination;