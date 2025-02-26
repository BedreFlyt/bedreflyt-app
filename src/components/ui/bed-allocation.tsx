import React, { useState } from "react";
import { Button, Form, InputGroup, ListGroup, Card, Modal } from "react-bootstrap";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";

import { Patient, Treatment } from "../../types/types";
import CustomPagination from "./custom-pagination.tsx";

const ITEMS_PER_PAGE = 15;

interface AllocationPanelProps {
  availablePatients: Patient[];
  treatments: Treatment[];
}

interface PatientWithTreatment extends Patient {
  treatment: Treatment;
}

const AllocationPanel: React.FC<AllocationPanelProps> = ({ 
  availablePatients, 
  treatments
}) => {
  const [patients, setPatients] = useState<PatientWithTreatment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showTreatmentSelect, setShowTreatmentSelect] = useState(false);

  const filteredPatients = availablePatients.filter(patient => 
    `${patient.patientName} ${patient.patientSurname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination for users in modal
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowTreatmentSelect(true);
  };

  const handleTreatmentSelect = (treatment: Treatment) => {
    if (selectedPatient) {
      setPatients([...patients, { ...selectedPatient, treatment }]);
      setShowModal(false);
      setSearchTerm("");
      setSelectedPatient(null);
      setShowTreatmentSelect(false);
      setCurrentPage(1);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setShowTreatmentSelect(false);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Replace the existing InputGroup with this button
  const addPatientButton = (
    <Button variant="success" onClick={() => setShowModal(true)} className="mb-3">
      <FaPlus /> Add Patient
    </Button>
  );

  // Add this modal component
  const searchModal = (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {showTreatmentSelect ? 'Select Treatment' : 'Search Patients'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showTreatmentSelect ? (
          <>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <ListGroup>
              {currentItems.map((patient) => (
                <ListGroup.Item
                  key={patient.patientId}
                  className="d-flex justify-content-between align-items-center"
                  action
                >
                  <span>{patient.patientId} - {patient.patientName} {patient.patientSurname}</span>
                  <Button variant="primary" size="sm" onClick={() => handleSelectPatient(patient)}>
                    Select
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="d-flex justify-content-center mt-3">
              <CustomPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <ListGroup>
            {treatments.map((treatment) => (
              <ListGroup.Item
                key={treatment.diagnosis + '_' + treatment.treatmentId}
                className="d-flex justify-content-between align-items-center"
                action
              >
                <span>{treatment.diagnosis}_{treatment.treatmentId}</span>
                <Button variant="primary" size="sm" onClick={() => handleTreatmentSelect(treatment)}>
                  Select
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );

  const removePatient = (index) => {
    setPatients(patients.filter((_, i) => i !== index));
  };

  const allocatePatients = () => {
    console.log("Allocating patients:", patients);
    alert("Patients allocated successfully!");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Patients to allocate</h5>
        <Button variant="primary" onClick={allocatePatients}>
          Allocate
        </Button>
      </div>

      {addPatientButton}
      {searchModal}

      <ListGroup>
        {patients.map((patient, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between">
            {patient.patientId} - {patient.patientName} {patient.patientSurname} - {patient.treatment.diagnosis}_{patient.treatment.treatmentId}
            <Button variant="danger" size="sm" onClick={() => removePatient(index)}>
              <FaTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default AllocationPanel;