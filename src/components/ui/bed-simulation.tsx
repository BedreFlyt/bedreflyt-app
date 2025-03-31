import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

import { postSimulationScenario, postSimulationScenarioGlobal, postMultiSimulationScenario, getWardData } from "../../services/apiService.ts";
import { SimulationRequest, SimulationResponse, ScenarioRequest, MultiSimulationRequest, Ward } from "../../types/types";
import PatientDistribution from "./patients-distribution.tsx";

const SimulationPanel = () => {
  const [caseType, setCaseType] = useState("common");
  const [solveType, setSolveType] = useState("daily");
  const [risk, setRisk] = useState(0.5);
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(null);
  const [results, setResults] = useState<SimulationResponse>({ allocations: [], changes: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [wardData, setWardData] = useState<Ward[] | undefined>(undefined);

  const [selectedWard, setSelectedWard] = useState<string>("Neurosurgery");
  const [selectedHospital, setSelectedHospital] = useState<string>("OSL-RH");


  useEffect(() => {
      const fetchData = async () => {
        try {
          const wardData: Ward[] = await getWardData();
  
          setWardData(wardData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result !== undefined) {
          setFileContent(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSimulate = () => {
    console.log("Simulating...");
    if (fileContent) {
      const lines = (fileContent as string).split("\n");
      const scenarioRequests: ScenarioRequest[] = lines
        .map(line => line.trim())
        .filter(line => line !== "")
        .map(line => {
          const [batch, patientId, diagnosis] = line.split(" ");
          return {
            batch: Number(batch),
            patientId,
            diagnosis
          };
        });

      console.log ("Scenario Requests:", scenarioRequests);
      let simulationRequest: SimulationRequest;
      switch (solveType) {
        case "daily":
          switch (caseType) {
            case "worst":
              simulationRequest = {
                scenario: scenarioRequests,
                mode: caseType,
                smtMode: "changes",
                wardName: selectedWard,
                hospitalCode: selectedHospital
              };

              postSimulationScenario(simulationRequest)
                .then(response => {
                  setResults(response);
                  setCurrentPage(1);
                  console.log("Simulation successful:", response);
                })
                .catch(error => {
                  console.error("Simulation failed:", error);
                });
              break;
            case "common":
              simulationRequest = {
                scenario: scenarioRequests,
                mode: caseType,
                smtMode: "changes",
                wardName: selectedWard,
                hospitalCode: selectedHospital
              };

              postSimulationScenario(simulationRequest)
                .then(response => {
                  setResults(response);
                  setCurrentPage(1);
                  console.log("Simulation successful:", response);
                })
                .catch(error => {
                  console.error("Simulation failed:", error);
                });
              break;
            default:
              const multiSimulationRequest: MultiSimulationRequest = {
                scenario: scenarioRequests,
                repetitions: 1,
                risk: risk,
                smtMode: "changes",
                wardName: selectedWard,
                hospitalCode: selectedHospital
              };

              postMultiSimulationScenario(multiSimulationRequest)
                .then(response => {
                  console.log("Simulation successful:", response);
                  setResults(response);
                  setCurrentPage(1);
                })
                .catch(error => {
                  console.error("Simulation failed:", error);
                });
              break;
          }
          break;
        case "global":
          const globalSimulationRequest: SimulationRequest = {
            scenario: scenarioRequests,
            mode: caseType,
            smtMode: "changes",
            wardName: selectedWard,
            hospitalCode: selectedHospital
          };

          postSimulationScenarioGlobal(globalSimulationRequest)
            .then(response => {
              setResults(response);
              setCurrentPage(1);
              console.log("Simulation successful:", response);
            })
            .catch(error => {
              console.error("Simulation failed:", error);
            });
          break;
      }
    }
  };

  return (
    <div>
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

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Ward</Form.Label>
              <Form.Select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                {wardData && wardData.map((ward) => (
                  <option key={ward.wardName} value={ward.wardName}>
                    {ward.wardName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Hospital</Form.Label>
              <Form.Select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
              >
                {wardData && wardData.map((ward) => (
                  <option key={ward.wardHospital.hospitalCode} value={ward.wardHospital.hospitalCode}>
                    {ward.wardHospital.hospitalCode}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Risk Slider */}
        <Row className="mb-3">
        <Col>
          <Form.Label>Risk ({risk})</Form.Label>
          <Form.Range 
            value={risk} 
            onChange={(e) => setRisk(Number(e.target.value))} 
            min={0}
            max={1}
            step={0.01}
          />
          <div className="d-flex justify-content-between">
            <small>0</small>
            <small>1</small>
          </div>
        </Col>
          <Col className="d-flex align-items-center">
            <Form.Label style={{ padding: "1em" }}>Scenario</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Col>
        </Row>

        {/* Simulate Button */}
        <Button variant="primary" size="lg" className="w-100" style={{ maxWidth: "150px" }} onClick={handleSimulate}>
          Simulate
        </Button>
      </Container>

      <PatientDistribution results={results} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default SimulationPanel;
