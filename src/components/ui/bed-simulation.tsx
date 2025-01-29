import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const SimulationPanel = () => {
  const [caseType, setCaseType] = useState("common");
  const [solveType, setSolveType] = useState("global");
  const [risk, setRisk] = useState(50);

  return (
    <Container className="p-3 border rounded shadow-sm" style={{ maxWidth: "800px" }}>
      {/* Case Selection */}
      <Row className="mb-2">
        <Col>
          <Form.Check
            type="radio"
            label="Worst case"
            name="caseType"
            value="worst"
            checked={caseType === "worst"}
            onChange={() => setCaseType("worst")}
          />
        </Col>
        <Col>
          <Form.Check
            type="radio"
            label="Common case"
            name="caseType"
            value="common"
            checked={caseType === "common"}
            onChange={() => setCaseType("common")}
          />
        </Col>
        <Col>
          <Form.Check
            type="radio"
            label="Sampling"
            name="caseType"
            value="sampling"
            checked={caseType === "sampling"}
            onChange={() => setCaseType("sampling")}
          />
        </Col>
      </Row>

      {/* Solve Type Selection */}
      <Row className="mb-3">
        <Col>
          <Form.Check
            type="radio"
            label="Daily solve"
            name="solveType"
            value="daily"
            checked={solveType === "daily"}
            onChange={() => setSolveType("daily")}
          />
        </Col>
        <Col>
          <Form.Check
            type="radio"
            label="Global solve"
            name="solveType"
            value="global"
            checked={solveType === "global"}
            onChange={() => setSolveType("global")}
          />
        </Col>
      </Row>

      {/* Risk Slider */}
      <Row className="mb-3">
        <Col>
          <Form.Label>Risk</Form.Label>
          <Form.Range value={risk} onChange={(e) => setRisk(Number(e.target.value))} />
        </Col>
        <Col className="d-flex align-items-center">
          <Form.Label style={{ padding: "1em" }}>Scenario</Form.Label>
          <Form.Control type="file" />
        </Col>
      </Row>

      {/* Simulate Button */}
      <Button variant="primary" size="lg" className="w-100" style={{ maxWidth: "150px" }}>
        Simulate
      </Button>
    </Container>
  );
};

export default SimulationPanel;
