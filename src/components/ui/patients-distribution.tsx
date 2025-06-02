import React from "react";
import { Container, Table, Pagination } from "react-bootstrap";
import { SimulationResponse } from "../../types/types";

interface SimulationResultsProps {
  results: SimulationResponse;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const getPaginationNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): (number | string)[] => {
  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisiblePages / 2);

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage > halfVisible + 1) {
      pages.push(1, "...");
    }

    const start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, currentPage + halfVisible);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - halfVisible) {
      pages.push("...", totalPages);
    }
  }

  return pages;
};

const PatientDistribution: React.FC<SimulationResultsProps> = ({
  results,
  currentPage,
  setCurrentPage,
}) => {
  const currentDayAllocation = results?.allocations?.[currentPage - 1];
  const totalDays = results?.allocations?.length || 0;

  const renderPagination = () => {
    const paginationNumbers = getPaginationNumbers(currentPage, totalDays);

    return (
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {paginationNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Pagination.Item
              key={index}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis key={index} disabled />
          )
        )}
        <Pagination.Next
          onClick={() => setCurrentPage(Math.min(totalDays, currentPage + 1))}
          disabled={currentPage === totalDays}
        />
        <Pagination.Last onClick={() => setCurrentPage(totalDays)} disabled={currentPage === totalDays} />
      </Pagination>
    );
  };

  return (
    <Container className="p-3 border rounded shadow-sm mt-3" style={{ maxWidth: "1400px" }}>
      <h4>Results</h4>
      {totalDays > 0 ? (
        <>
          <div className="mb-3">
            <h5>Hour {currentPage}</h5>
            <div className="text-muted mb-2">
              Total changes: {results.changes}
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Gender</th>
                  <th>Patients</th>
                </tr>
              </thead>
              <tbody>
                {currentDayAllocation &&
                  Object.entries(currentDayAllocation).map(([roomId, room]) => (
                    <tr key={roomId}>
                      <td>{Number(roomId) + 1}</td>
                      <td>{room.gender}</td>
                      <td>
                        {room.patients.map((patient, patientIndex) => (
                          <div key={patientIndex}>
                            {patient.patientName} {patient.patientSurname}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
          {renderPagination()}
        </>
      ) : (
        <p>No results available. Run a simulation to see results.</p>
      )}
    </Container>
  );
};

export default PatientDistribution;