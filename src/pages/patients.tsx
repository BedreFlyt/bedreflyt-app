import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

import { createPatient, getPatientData, updatePatient } from '../services/apiService.ts';
import { Patient, PatientRequest } from '../types/types.ts';
import CustomPagination from '../components/ui/custom-pagination.tsx';

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    address: '',
    city: '',
    birthdate: '',
    gender: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 15; // Number of patients per page

  // Mock data - replace with actual API calls
  useEffect(() => {
    getPatientData().then(data => setPatients(data));
  }, []);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (patient?: Patient) => {
    if (patient) {
      setCurrentPatient(patient);
      setFormData({
        name: patient.patientName,
        surname: patient.patientSurname,
        address: patient.patientAddress,
        city: patient.city,
        birthdate: patient.patientBirthdate || '',
        gender: patient.gender,
        
      });
    } else {
      setCurrentPatient(null);
      setFormData({
        name: '',
        surname: '',
        address: '',
        city: '',
        birthdate: '',
        gender: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPatient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPatient) {
        // Update existing patient
        const updatedPatient = await updatePatient(currentPatient.patientId, {
          patientName: formData.name,
          patientSurname: formData.surname,
          patientAddress: formData.address,
          city: formData.city,
          patientBirthdate: formData.birthdate,
          gender: formData.gender
        });
        setPatients(patients.map(patient => 
          patient.patientId === currentPatient.patientId 
            ? updatedPatient
            : patient
        ));
      } else {
        // Create new patient
        const newPatientRequest: PatientRequest = {
          patientName: formData.name,
          patientSurname: formData.surname,
          patientAddress: formData.address,
          city: formData.city,
          patientBirthdate: formData.birthdate,
          gender: formData.gender
        };
        const createdPatient = await createPatient(newPatientRequest);
        setPatients([...patients, createdPatient]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving patient:', error);
      // Handle error (show error message to user)
    }
  };

  const handleDelete = (id: String) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setPatients(patients.filter(patient => patient.patientId !== id));
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Person Anagraphic Management</h2>
        <Button 
          variant="success" 
          onClick={() => handleShowModal()}
          className="rounded-circle"
        >
          <FaPlus />
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map(patient => (
            <tr key={patient.patientId}>
              <td>{patient.patientName}</td>
              <td>{patient.patientSurname}</td>
              <td>{patient.gender}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleShowModal(patient)}
                >
                  <FaPencilAlt />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(patient.patientId)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentPatient ? 'Edit User' : 'Add New User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Surname</Form.Label>
            <Form.Control
              type="text"
              value={formData.surname}
              onChange={(e) => setFormData({...formData, surname: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </Form.Select>
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentPatient ? 'Update' : 'Add'} Patient
            </Button>
          </div>
        </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Patients;