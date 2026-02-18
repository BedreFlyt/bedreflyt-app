import React, { useState, useEffect, useMemo } from "react";
import { Container, Table, Button, Form, Alert, Nav, Tab } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { SimulationResponse, RoomAllocationDTO, Patient } from "../../types/types";
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
  const [editedRooms, setEditedRooms] = useState<RoomAllocationDTO[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeWard, setActiveWard] = useState<string>("");

  // allocations[0] is the first (and only) outer list, [0] again gives the flat list of rooms
  const currentRooms = useMemo<RoomAllocationDTO[]>(
    () => results?.allocations?.[0]?.[0] ?? [],
    [results]
  );

  // Derive sorted unique ward names
  const wardNames = useMemo<string[]>(
    () => Array.from(new Set(currentRooms.map((r) => r.wardName))).sort(),
    [currentRooms]
  );

  useEffect(() => {
    if (wardNames.length > 0 && !activeWard) {
      setActiveWard(wardNames[0]);
    }
  }, [wardNames, activeWard]);

  useEffect(() => {
    if (!isEditing) {
      setEditedRooms(JSON.parse(JSON.stringify(currentRooms)));
    }
  }, [currentRooms, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedRooms(JSON.parse(JSON.stringify(currentRooms)));
    }
    setIsEditing(!isEditing);
    setSaveMessage(null);
  };

  const getRoomKey = (room: RoomAllocationDTO) =>
    `${room.wardName}-${room.roomNumber}`;

  const handlePatientChange = (roomKey: string, patientIndex: number, newPatientId: string) => {
    const updated = editedRooms.map((room) => {
      if (getRoomKey(room) !== roomKey) return room;
      const newPatients = [...room.patients];
      const found = getAllPatients(currentRooms).find((p) => p.patientId === newPatientId);
      if (found) newPatients[patientIndex] = found;
      return { ...room, patients: newPatients };
    });
    setEditedRooms(updated);
  };

  const handleRemovePatient = (roomKey: string, patientIndex: number) => {
    const updated = editedRooms.map((room) => {
      if (getRoomKey(room) !== roomKey) return room;
      const newPatients = room.patients.filter((_, i) => i !== patientIndex);
      return { ...room, patients: newPatients };
    });
    setEditedRooms(updated);
  };

  const handleAddPatient = (roomKey: string, patientId: string) => {
    const found = getAllPatients(currentRooms).find((p) => p.patientId === patientId);
    if (!found) return;
    const updated = editedRooms.map((room) => {
      if (getRoomKey(room) !== roomKey) return room;
      return { ...room, patients: [...room.patients, found] };
    });
    setEditedRooms(updated);
  };

  const getAllPatients = (rooms: RoomAllocationDTO[]): Patient[] => {
    const seen = new Set<string>();
    const patients: Patient[] = [];
    rooms.forEach((room) =>
      room.patients.forEach((p) => {
        if (!seen.has(p.patientId)) {
          seen.add(p.patientId);
          patients.push(p);
        }
      })
    );
    return patients;
  };

  const getAvailablePatientsForRoom = (
    roomKey: string,
    excludePatientId?: string
  ): Patient[] => {
    const room = editedRooms.find((r) => getRoomKey(r) === roomKey);
    const occupiedIds = new Set(
      room?.patients.map((p) => p.patientId).filter((id) => id !== excludePatientId) ?? []
    );
    return getAllPatients(currentRooms).filter((p) => !occupiedIds.has(p.patientId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const updatedResponse = {
        allocations: [[editedRooms]],
        changes: results.changes,
      };
      console.log("Sending updated allocation:", updatedResponse);
      await updateAllocationFromResults(updatedResponse as any);
      setSaveMessage({ type: 'success', text: 'Allocation saved successfully!' });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to save allocation:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to save allocation. Please try again.';
      setSaveMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const displayRooms = isEditing ? editedRooms : currentRooms;
  const hasResults = currentRooms.length > 0;

  const renderRoomTable = (rooms: RoomAllocationDTO[]) => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Room</th>
          <th>Gender</th>
          <th>Patients</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => {
          const roomKey = getRoomKey(room);
          return (
            <tr key={roomKey}>
              <td>{room.roomNumber}</td>
              <td>{room.gender}</td>
              <td>
                {room.patients.map((patient, patientIndex) => (
                  <div key={patientIndex} className="mb-2 d-flex align-items-center gap-2">
                    {isEditing ? (
                      <>
                        <Form.Select
                          value={patient.patientId}
                          onChange={(e) =>
                            handlePatientChange(roomKey, patientIndex, e.target.value)
                          }
                          size="sm"
                          className="flex-grow-1"
                        >
                          <option value={patient.patientId}>
                            {patient.patientName} {patient.patientSurname} ({patient.patientId})
                          </option>
                          {getAvailablePatientsForRoom(roomKey, patient.patientId).map((p) => (
                            <option key={p.patientId} value={p.patientId}>
                              {p.patientName} {p.patientSurname} ({p.patientId})
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemovePatient(roomKey, patientIndex)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    ) : (
                      <span>
                        {patient.patientName} {patient.patientSurname}
                      </span>
                    )}
                  </div>
                ))}
                {isEditing && getAvailablePatientsForRoom(roomKey).length > 0 && (
                  <div className="mt-2">
                    <Form.Select
                      size="sm"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddPatient(roomKey, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">+ Add patient to room</option>
                      {getAvailablePatientsForRoom(roomKey).map((p) => (
                        <option key={p.patientId} value={p.patientId}>
                          {p.patientName} {p.patientSurname} ({p.patientId})
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );

  return (
    <Container className="p-3 border rounded shadow-sm mt-3" style={{ maxWidth: "1400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Results</h4>
        {hasResults && (
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
              <Button variant="success" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        )}
      </div>

      {saveMessage && (
        <Alert
          variant={saveMessage.type === 'success' ? 'success' : 'danger'}
          dismissible
          onClose={() => setSaveMessage(null)}
        >
          {saveMessage.text}
        </Alert>
      )}

      {hasResults ? (
        <>
          <div className="text-muted mb-3">Total changes: {results.changes}</div>
          <Tab.Container activeKey={activeWard} onSelect={(k) => k && setActiveWard(k)}>
            <Nav variant="tabs" className="mb-3">
              {wardNames.map((ward) => (
                <Nav.Item key={ward}>
                  <Nav.Link eventKey={ward}>{ward}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Tab.Content>
              {wardNames.map((ward) => (
                <Tab.Pane key={ward} eventKey={ward}>
                  {renderRoomTable(
                    displayRooms.filter((r) => r.wardName === ward)
                  )}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </>
      ) : (
        <p>No results available. Run a simulation to see results.</p>
      )}
    </Container>
  );
};

export default PatientDistribution;