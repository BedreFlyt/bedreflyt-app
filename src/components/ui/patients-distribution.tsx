import React from "react";
import { Container, Table, Pagination } from "react-bootstrap";
import { SimulationResponse } from "../../types/types";

interface SimulationResultsProps {
  results: SimulationResponse;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PatientDistribution: React.FC<SimulationResultsProps> = ({
  results,
  currentPage,
  setCurrentPage,
}) => {
  // Get the current day's allocation
  const currentDayAllocation = results?.allocations?.[currentPage - 1];
  const totalDays = results?.allocations?.length || 0;

  return (
    <Container className="p-3 border rounded shadow-sm mt-3" style={{ maxWidth: "1400px" }}>
      <h4>Simulation Results</h4>
      {totalDays > 0 ? (
        <>
          <div className="mb-3">
            <h5>Day {currentPage}</h5>
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
                {currentDayAllocation && Object.entries(currentDayAllocation).map(([roomId, room]) => (
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
          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} />
            <Pagination.Prev 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(pageNum => (
              <Pagination.Item
                key={pageNum}
                active={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(Math.min(totalDays, currentPage + 1))}
              disabled={currentPage === totalDays}
            />
            <Pagination.Last onClick={() => setCurrentPage(totalDays)} />
          </Pagination>
        </>
      ) : (
        <p>No results available. Run a simulation to see results.</p>
      )}
    </Container>
  );
};

export default PatientDistribution;