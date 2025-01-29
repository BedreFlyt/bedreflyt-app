import React from "react";
import { Container, Tabs, Tab } from "react-bootstrap";

import SimulationPanel from "../components/ui/bed-simulation.tsx";

const BedAllocation = () => {
  return (
    <Container className="p-3 border rounded shadow-sm" style={{ maxWidth: "1500px" }}>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Home">
          Tab content for Home
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <SimulationPanel />
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          Tab content for Contact
        </Tab>
      </Tabs>
    </Container>
  );
};

export default BedAllocation;
