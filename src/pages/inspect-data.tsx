import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import GenericTable from "../components/ui/data-table.tsx";
import { getPatientData, getTreatmentData, getRoomData, 
  getTaskData, getDiagnosisData, getMonitoringCategoryData,
  getCityData, getWardData, getHospitalData } from "../services/apiService.ts";
import { Patient, Room, Task, Diagnosis, Treatment, MonitoringCategory,
  City, Ward, Hospital} from "../types/types.ts";
import { patientColumns, roomColumns, taskColumns, diagnosisColumns,
  treatmentColumns, monitoringCategoryColumns, cityColumns,
  wardColumns, hospitalColumns } from "../types/types.ts";

const DataInspector = () => {
  const [patientData, setPatientData] = useState<Patient[]>([]);
  const [treatmentData, setTreatmentData] = useState<Treatment[]>([]);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<Diagnosis[]>([]);
  const [monitoringCategoryData, setMonitoringCategoryData] = useState<MonitoringCategory[]>([]);
  const [cityData, setCityData] = useState<City[]>([]);
  const [wardData, setWardData] = useState<Ward[]>([]);
  const [hospitalData, setHospitalData] = useState<Hospital[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientData();
        const treatmentData = await getTreatmentData();
        const roomData = await getRoomData();
        console.log(roomData);
        const taskData = await getTaskData();
        const diagnosisData = await getDiagnosisData();
        const monitoringCategoryData = await getMonitoringCategoryData();
        const cityData = await getCityData();
        const wardData = await getWardData();
        const hospitalData = await getHospitalData();

        setPatientData(patientData);
        setTreatmentData(treatmentData);
        setRoomData(roomData);
        setTaskData(taskData);
        setDiagnosisData(diagnosisData);
        setMonitoringCategoryData(monitoringCategoryData);
        setCityData(cityData);
        setWardData(wardData);
        setHospitalData(hospitalData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatTableData = (data: any[], columns: any[]) => {
    const prettifyValue = (value: any): any => {
      if (typeof value === 'object' && value !== null) {
        // Handle arrays
        if (Array.isArray(value)) {
          return value.map(prettifyValue).join(', ');
        }
        // Handle nested objects
        return Object.entries(value)
          .map(([key, val]) => `${key}: ${prettifyValue(val)}`) // Recursively prettify nested objects
          .join(', ');
      }
      return value; // Return primitive values as is
    };
  
    return data.map(row => {
      const formattedRow = { ...row };
      Object.keys(formattedRow).forEach(key => {
        formattedRow[key] = prettifyValue(formattedRow[key]);
      });
      return formattedRow;
    });
  };

  return (
    <Container className="p-3 border rounded shadow-sm" style={{ maxWidth: "1500px" }}>
      <Tabs
        defaultActiveKey="patients"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="patients" title="Patients Anagraphical Information">
          <GenericTable data={formatTableData(patientData, patientColumns)} columns={patientColumns} />
        </Tab>
        <Tab eventKey="rooms" title="Rooms">
          <GenericTable data={formatTableData(roomData, roomColumns)} columns={roomColumns} />
        </Tab>
        <Tab eventKey="tasks" title="Tasks">
          <GenericTable data={formatTableData(taskData, taskColumns)} columns={taskColumns} />
        </Tab>
        <Tab eventKey="diagnosis" title="Diagnosis">
          <GenericTable data={formatTableData(diagnosisData, diagnosisColumns)} columns={diagnosisColumns} />
        </Tab>
        <Tab eventKey="treatments" title="Treatments">
          <GenericTable data={formatTableData(treatmentData, treatmentColumns)} columns={treatmentColumns} />
        </Tab>
        <Tab eventKey="monitoring-categories" title="Monitoring Categories">
          <GenericTable data={formatTableData(monitoringCategoryData, monitoringCategoryColumns)} columns={monitoringCategoryColumns} />
        </Tab>
        <Tab eventKey="cities" title="Cities">
          <GenericTable data={formatTableData(cityData, cityColumns)} columns={cityColumns} />
        </Tab>
        <Tab eventKey="wards" title="Wards">
          <GenericTable data={formatTableData(wardData, wardColumns)} columns={wardColumns} />
        </Tab>
        <Tab eventKey="hospitals" title="Hospitals">
          <GenericTable data={formatTableData(hospitalData, hospitalColumns)} columns={hospitalColumns} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default DataInspector;