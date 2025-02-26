import React, { useState } from "react";
import { Button, ListGroup, Card } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";

import { Patient, Treatment } from "../../types/types";
import SearchModal from "./search-modal.tsx";

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
  const [treatmentCurrentPage, setTreatmentCurrentPage] = useState(1);
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
  // Pagination elements for treatments
  const indexOfLastTreatment = treatmentCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstTreatment = indexOfLastTreatment - ITEMS_PER_PAGE;
  const currentTreatments = treatments.slice(indexOfFirstTreatment, indexOfLastTreatment);
  const treatmentTotalPages = Math.ceil(treatments.length / ITEMS_PER_PAGE);

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

  const searchModalComponent = (
    <SearchModal
      show={showModal}
      onHide={handleClose}
      showTreatmentSelect={showTreatmentSelect}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentItems={currentItems}
      treatments={treatments}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onSelectPatient={handleSelectPatient}
      onSelectTreatment={handleTreatmentSelect}
      treatmentCurrentPage={treatmentCurrentPage}
      treatmentTotalPages={treatmentTotalPages}
      onTreatmentPageChange={setTreatmentCurrentPage}
      currentTreatments={currentTreatments}
    />
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
      {searchModalComponent}

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