import React, { useState, JSX } from "react";
import { Table, Pagination } from "react-bootstrap";
import CustomPagination from "./custom-pagination.tsx";

interface Column {
  header: string;
  accessor: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column[];
  itemsPerPage?: number;
}

const GenericTable = <T,>({ data, columns, itemsPerPage = 10 }: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead className="thead-dark">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.accessor}>{(item as any)[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <CustomPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default GenericTable;