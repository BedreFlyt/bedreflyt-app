import React from "react";
import { useState, useEffect } from "react";
// import { Container, Table, Pagination } from "react-bootstrap";
import { PatientAllocation, patientAllocationColumns } from "../../types/types.ts";
import GenericTable from "./data-table.tsx";
import { getPatientAllocationData } from "../../services/apiService.ts";

const Allocations = () => {
  const [patientData, setPatientData] = useState<PatientAllocation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientAllocationData();
        console.log("Raw API response:", data);
        console.log("Response type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        if (Array.isArray(data)) {
          console.log("Array length:", data.length);
          if (data.length > 0) {
            console.log("First item:", data[0]);
          }
        }
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }
  , []);

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
    <GenericTable data={formatTableData(patientData, patientAllocationColumns)} columns={patientAllocationColumns} />
  );
};

export default Allocations;
