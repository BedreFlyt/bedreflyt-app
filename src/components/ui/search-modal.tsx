import React from 'react';
import { Modal, InputGroup, Form, ListGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Patient, Treatment } from '../../types/types';
import CustomPagination from './custom-pagination.tsx';

interface SearchModalProps {
  show: boolean;
  onHide: () => void;
  showTreatmentSelect: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentItems: Patient[];
  treatments: Treatment[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectPatient: (patient: Patient) => void;
  onSelectTreatment: (treatment: Treatment) => void;
  treatmentCurrentPage: number;
  treatmentTotalPages: number;
  onTreatmentPageChange: (page: number) => void;
  currentTreatments: Treatment[];
}

const SearchModal: React.FC<SearchModalProps> = ({
  show,
  onHide,
  showTreatmentSelect,
  searchTerm,
  onSearchChange,
  currentItems,
  treatments,
  currentPage,
  totalPages,
  onPageChange,
  onSelectPatient,
  onSelectTreatment,
  treatmentCurrentPage,
  treatmentTotalPages,
  onTreatmentPageChange,
  currentTreatments,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
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
                onChange={(e) => onSearchChange(e.target.value)}
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
                  <Button variant="primary" size="sm" onClick={() => onSelectPatient(patient)}>
                    Select
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="d-flex justify-content-center mt-3">
              <CustomPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : (
          <>
            <ListGroup>
              {currentTreatments.map((treatment) => (
                <ListGroup.Item
                  key={treatment.diagnosis + '_' + treatment.treatmentId}
                  className="d-flex justify-content-between align-items-center"
                  action
                >
                  <span>{treatment.diagnosis}_{treatment.treatmentId}</span>
                  <Button variant="primary" size="sm" onClick={() => onSelectTreatment(treatment)}>
                    Select
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="d-flex justify-content-center mt-3">
              <CustomPagination 
                currentPage={treatmentCurrentPage}
                totalPages={treatmentTotalPages}
                onPageChange={onTreatmentPageChange}
              />
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;