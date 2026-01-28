import React, { useState, useEffect } from "react";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa";
import { SimulationResponse, DayAllocation, Patient } from "../../types/types";
import { updateAllocationFromResults } from "../../services/apiService.ts";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedAllocation, setEditedAllocation] = useState<DayAllocation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Only display the first allocation
  const currentDayAllocation = results?.allocations?.[0];
  const totalDays = 1; // Always show only first allocation

  useEffect(() => {
    if (currentDayAllocation && !isEditing) {
      setEditedAllocation(JSON.parse(JSON.stringify(currentDayAllocation)));
    }
  }, [currentDayAllocation, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original
      setEditedAllocation(JSON.parse(JSON.stringify(currentDayAllocation)));
    }
    setIsEditing(!isEditing);
    setSaveMessage(null);
  };

  const handlePatientChange = (roomId: string, patientIndex: number, newPatientId: string) => {
    if (!editedAllocation) return;
    
    const updatedAllocation = { ...editedAllocation };
    const room = updatedAllocation[roomId];
    
    if (room && room.patients[patientIndex]) {
      // Find the patient from all rooms
      let foundPatient: Patient | null = null;
      Object.values(editedAllocation).forEach(r => {
        const patient = r.patients.find(p => p.patientId === newPatientId);
        if (patient) foundPatient = patient;
      });
      
      if (foundPatient) {
        room.patients[patientIndex] = foundPatient;
        setEditedAllocation(updatedAllocation);
      }
    }
  };

  const handleRemovePatient = (roomId: string, patientIndex: number) => {
    if (!editedAllocation) return;
    
    const updatedAllocation = { ...editedAllocation };
    const room = updatedAllocation[roomId];
    
    if (room) {
      room.patients.splice(patientIndex, 1);
      setEditedAllocation(updatedAllocation);
    }
  };

  const handleAddPatient = (roomId: string, patientId: string) => {
    if (!editedAllocation) return;
    
    const updatedAllocation = { ...editedAllocation };
    const room = updatedAllocation[roomId];
    
    // Find the patient from all rooms
    let foundPatient: Patient | null = null;
    Object.values(editedAllocation).forEach(r => {
      const patient = r.patients.find(p => p.patientId === patientId);
      if (patient) foundPatient = patient;
    });
    
    if (room && foundPatient) {
      room.patients.push(foundPatient);
      setEditedAllocation(updatedAllocation);
    }
  };

  const getAvailablePatientsForRoom = (roomId: string, currentPatientId?: string): Patient[] => {
    if (!editedAllocation) return [];
    const room = editedAllocation[roomId];
    // Get all patient IDs in this room, excluding the current patient being edited
    const roomPatientIds = new Set(
      room?.patients
        .map(p => p.patientId)
        .filter(id => id !== currentPatientId) || []
    );
    return allPatients.filter(p => !roomPatientIds.has(p.patientId));
  };

  const handleSave = async () => {
    if (!editedAllocation) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Transform the edited allocation back to the format expected by the backend
      const transformedAllocation = Object.entries(editedAllocation).map(([roomId, roomData]) => {
        return {
          roomNumber: roomData.roomDetails.roomNumber,
          wardName: roomData.roomDetails.treatmentWard.wardName,
          hospitalCode: roomData.roomDetails.hospital.hospitalCode,
          patients: roomData.patients,
          gender: roomData.gender
        };
      });

      const updatedResponse = {
        allocations: [[transformedAllocation]],
        changes: results.changes
      };
      
      console.log("Sending updated allocation:", updatedResponse);
      // Backend expects the DTO format with RoomAllocationItem[], not DayAllocation
      await updateAllocationFromResults(updatedResponse as any);
      setSaveMessage({ type: 'success', text: 'Allocation saved successfully!' });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to save allocation:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save allocation. Please try again.';
      setSaveMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const getAllPatients = (): Patient[] => {
    // Get all unique patients from the ORIGINAL allocation (not edited)
    // This ensures we have access to all patients even if they're removed from rooms
    if (!currentDayAllocation) return [];
    const patients: Patient[] = [];
    Object.values(currentDayAllocation).forEach(room => {
      room.patients.forEach(patient => {
        if (!patients.find(p => p.patientId === patient.patientId)) {
          patients.push(patient);
        }
      });
    });
    return patients;
  };

  const displayAllocation = isEditing ? editedAllocation : currentDayAllocation;
  const allPatients = getAllPatients();

  return (
    <Container className="p-3 border rounded shadow-sm mt-3" style={{ maxWidth: "1400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Results</h4>
        {totalDays > 0 && (
          <div>
            <Button 
              variant={isEditing ? "secondary" : "primary"} 
              onClick={handleEditToggle}
              disabled={isSaving}
              className="me-2"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && (
              <Button 
                variant="success" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {saveMessage && (
        <Alert variant={saveMessage.type === 'success' ? 'success' : 'danger'} dismissible onClose={() => setSaveMessage(null)}>
          {saveMessage.text}
        </Alert>
      )}
      
      {totalDays > 0 ? (
        <>
          <div className="mb-3">
            <h5>Allocation Results</h5>
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
                {displayAllocation &&
                  Object.entries(displayAllocation).map(([roomId, room]) => (
                    <tr key={roomId}>
                      <td>{Number(roomId) + 1}</td>
                      <td>{room.gender}</td>
                      <td>
                        {room.patients.map((patient, patientIndex) => (
                          <div key={patientIndex} className="mb-2 d-flex align-items-center gap-2">
                            {isEditing ? (
                              <>
                                <Form.Select
                                  value={patient.patientId}
                                  onChange={(e) => handlePatientChange(roomId, patientIndex, e.target.value)}
                                  size="sm"
                                  className="flex-grow-1"
                                >
                                  {getAvailablePatientsForRoom(roomId, patient.patientId).map((p) => (
                                    <option key={p.patientId} value={p.patientId}>
                                      {p.patientName} {p.patientSurname} ({p.patientId})
                                    </option>
                                  ))}
                                </Form.Select>
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  onClick={() => handleRemovePatient(roomId, patientIndex)}
                                >
                                  <FaTrash />
                                </Button>
                              </>
                            ) : (
                              <span>{patient.patientName} {patient.patientSurname}</span>
                            )}
                          </div>
                        ))}
                        {isEditing && getAvailablePatientsForRoom(roomId).length > 0 && (
                          <div className="mt-2">
                            <Form.Select
                              size="sm"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddPatient(roomId, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="">+ Add patient to room</option>
                              {getAvailablePatientsForRoom(roomId).map((p) => (
                                <option key={p.patientId} value={p.patientId}>
                                  {p.patientName} {p.patientSurname} ({p.patientId})
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <p>No results available. Run a simulation to see results.</p>
      )}
    </Container>
  );
};

export default PatientDistribution;