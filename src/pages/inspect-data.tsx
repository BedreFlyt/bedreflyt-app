import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import GenericTable from "../components/ui/data-table.tsx";
import { getPatientData, getTreatmentData, getRoomData, getTaskData, getDiagnosisData } from "../services/apiService.ts";
import { Patient, Room, Task, Diagnosis, Treatment } from "../types/types.ts";
import { patientColumns, roomColumns, taskColumns, diagnosisColumns, treatmentColumns } from "../types/types.ts";

const DataInspector = () => {
  const [patientData, setPatientData] = useState<Patient[]>([]);
  const [treatmentData, setTreatmentData] = useState<Treatment[]>([]);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientData();
        const treatmentData = await getTreatmentData();
        const roomData = await getRoomData();
        const taskData = await getTaskData();
        const diagnosisData = await getDiagnosisData();

        setPatientData(patientData);
        setTreatmentData(treatmentData);
        setRoomData(roomData);
        setTaskData(taskData);
        setDiagnosisData(diagnosisData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="p-3 border rounded shadow-sm" style={{ maxWidth: "1500px" }}>
      <Tabs
        defaultActiveKey="patients"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="patients" title="Patients">
          <GenericTable data={patientData} columns={patientColumns} />
        </Tab>
        <Tab eventKey="rooms" title="Rooms">
          <GenericTable data={roomData} columns={roomColumns} />
        </Tab>
        <Tab eventKey="tasks" title="Tasks">
          <GenericTable data={taskData} columns={taskColumns} />
        </Tab>
        <Tab eventKey="diagnosis" title="Diagnosis">
          <GenericTable data={diagnosisData} columns={diagnosisColumns} />
        </Tab>
        <Tab eventKey="treatments" title="Treatments">
          <GenericTable data={treatmentData} columns={treatmentColumns} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default DataInspector;