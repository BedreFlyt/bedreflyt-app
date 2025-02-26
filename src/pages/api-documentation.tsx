import React from "react";
import { Container } from "react-bootstrap";

const ApiDocumentation = () => {
  const baseUrl = process.env.BASE_URL || 'localhost';

  return (
    <Container className="p-3 border rounded shadow-sm">
      <iframe
        src={`http://${baseUrl}:8090/swagger-ui.html`}
        title="API Documentation"
        style={{ width: "100%", height: "85vh" }}
      />
    </Container>
  );
}

export default ApiDocumentation;