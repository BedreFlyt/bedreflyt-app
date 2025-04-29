import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import SimulationPanel from "../components/ui/bed-simulation.tsx";
import AllocationPanel from "../components/ui/bed-allocation.tsx";
import Allocations from "../components/ui/allocations.tsx";

import { getPatientData, getTreatmentData } from "../services/apiService.ts";

const BedAllocation = () => {
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientData();
        const treatmentData = await getTreatmentData();
        setPatients(patientData);
        setTreatments(treatmentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="p-3 border rounded shadow-sm" style={{ maxWidth: "1500px" }}>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Self-Adaptive Allocation">
          <AllocationPanel
            availablePatients={patients}
            treatments={treatments}
          />
        </Tab>
        <Tab eventKey="profile" title="Simulation">
          <SimulationPanel />
        </Tab>
        <Tab eventKey="contact" title="Current Allocation">
          <Allocations />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default BedAllocation;
