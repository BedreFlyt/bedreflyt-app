import React, { useEffect } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import SimulationPanel from "../components/ui/bed-simulation.tsx";

import { getPatientData, getTreatmentData } from "../services/apiService.ts";

const BedAllocation = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientData();
        const treatmentData = await getTreatmentData();
        console.log("Patient Data:", patientData);
        console.log("Treatment Data:", treatmentData);
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
        <Tab eventKey="home" title="Allocation">
          Tab content for Allocation
        </Tab>
        <Tab eventKey="profile" title="Simulation">
          <SimulationPanel />
        </Tab>
        <Tab eventKey="contact" title="Something" disabled>
          Tab content for Somethin
        </Tab>
      </Tabs>
    </Container>
  );
};

export default BedAllocation;
