import axios from 'axios';
import {
  SimulationRequest,
  MultiSimulationRequest,
  SimulationResponse,
  DayAllocation,
  Patient,
  PatientRequest,
  Room
} from '../types/types.ts';

const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds
const completeUrl = process.env.REACT_APP_COMPLETE_URL || 'http://localhost:8090';

const fetchData = async (url: string) => {
  const cachedData = localStorage.getItem(url);
  const now = Date.now();

  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    if (parsedData.expiry > now) {
      return parsedData.data;
    }
  }

  const response = await axios.get(url);
  const data = response.data;

  try {
    localStorage.setItem(url, JSON.stringify({ data, expiry: now + CACHE_DURATION }));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider clearing some space.');
    } else {
      throw e;
    }
  }

  return data;
};

export const createPatient = async (patientRequest: PatientRequest): Promise<Patient> => {
  const response = await fetch('/api/v1/patients/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientRequest),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create patient');
  }
  
  return response.json();
};

export const updatePatient = async (id: string, patientRequest: PatientRequest): Promise<Patient> => {
  const response = await fetch(`/api/v1/patients/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientRequest),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update patient');
  }
  
  return response.json();
};

export const getPatientData = async () => {
  const url = completeUrl + '/api/v1/patients';
  const response = await axios.get(url);
  return response.data;
};

export const getPatientAllocationData = async () => {
  const url = completeUrl + '/api/v1/patient-allocations';
  try {
    const response = await axios.get(url);
    console.log("Raw response from API:", response);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Response headers:", response.headers);
    
    // Check if response is a string (toString() representation)
    if (typeof response.data === 'string') {
      console.error("API returned a string instead of JSON! This is a backend issue.");
      console.error("String content:", response.data.substring(0, 500));
      throw new Error("Backend is returning malformed data (Java toString() instead of JSON)");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching patient allocation data:", error);
    throw error;
  }
}

export const getTreatmentData = () => {
  const url = completeUrl + '/api/v1/fuseki/treatments';
  return fetchData(url);
};

export const getRoomData = () => {
  const url = completeUrl + '/api/v1/fuseki/rooms';
  return fetchData(url);
};

export const getTaskData = () => {
  const url = completeUrl + '/api/v1/fuseki/tasks';
  return fetchData(url);
};

export const getDiagnosisData = () => {
  const url = completeUrl + '/api/v1/fuseki/diagnosis';
  return fetchData(url);
}

export const getWardData = () => {
  const url = completeUrl + '/api/v1/fuseki/wards';
  return fetchData(url);
};

export const getMonitoringCategoryData = () => {
  const url = completeUrl + '/api/v1/fuseki/monitoring-categories';
  return fetchData(url);
}

export const getCityData = () => {
  const url = completeUrl + '/api/v1/fuseki/cities';
  return fetchData(url);
}

export const getFloorData = () => {
  const url = completeUrl + '/api/v1/fuseki/floors';
  return fetchData(url);
}

export const getHospitalData = () => {
  const url = completeUrl + '/api/v1/fuseki/hospitals';
  return fetchData(url);
}

const transformSimulationResponse = async (response: any): Promise<SimulationResponse> => {
  // Fetch all rooms once
  const allRooms: Room[] = await getRoomData();

  console.log("Raw response.data:", response.data);
  console.log("Raw response.data.allocations:", response.data.allocations);
  console.log("Allocations length:", response.data.allocations?.length);
  console.log("First allocation:", response.data.allocations?.[0]);

  const allocations = response.data.allocations.map((dayAllocation: any[]) => {
    const transformedDay: DayAllocation = {};
    console.log("Processing dayAllocation:", dayAllocation);
    console.log("dayAllocation length:", dayAllocation?.length);

    // Process all rooms in the day allocation (new JSON format from DTO)
    dayAllocation.forEach((roomAllocationItem: any) => {
      console.log("Processing roomAllocationItem:", roomAllocationItem);
      
      // Unwrap if it's an array with a single element
      const item = Array.isArray(roomAllocationItem) ? roomAllocationItem[0] : roomAllocationItem;
      
      // The backend now returns RoomAllocationItem objects with direct properties
      if (item && item.roomNumber !== undefined) {
        const roomNumber = item.roomNumber;
        const wardName = item.wardName;
        const hospitalCode = item.hospitalCode;

        // Find the Room object corresponding to the details
        const roomData = allRooms.find(
          (room) =>
            room.roomNumber === roomNumber &&
            room.treatmentWard.wardName === wardName &&
            room.hospital.hospitalCode === hospitalCode
        );

        if (roomData) {
          transformedDay[roomData.roomNumber] = {
            gender: item.patients && item.patients.length > 0 
              ? item.gender || "Unknown" 
              : "",
            patients: item.patients || [],
            roomDetails: roomData
          };
        } else {
          console.warn(`Room not found for details: roomNumber=${roomNumber}, wardName=${wardName}, hospitalCode=${hospitalCode}`);
        }
      } else {
        console.warn(`Invalid roomAllocationItem:`, item);
      }
    });

    return transformedDay;
  });

  return {
    allocations: allocations,
    changes: response.data.changes || 0
  };
};

export const postAllocation = async (simulationRequest: SimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/v1/allocation/allocate';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}

export const postSimulationScenario = async (simulationRequest: SimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/v1/simulation/simulate';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}

export const postSimulationScenarioGlobal = async (simulationRequest: SimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/v1/simulation/simulate-global';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}

export const postMultiSimulationScenario = async (simulationRequest: MultiSimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/v1/simulation/simulate-many';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}

export const updateAllocationFromResults = async (simulationResponse: SimulationResponse): Promise<void> => {
  const url = completeUrl + '/api/v1/update-from-allocation';
  await axios.put(url, simulationResponse);
}
