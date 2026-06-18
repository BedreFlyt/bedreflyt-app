import axios from 'axios';
import {
  SimulationRequest,
  AllocationRequest,
  MultiSimulationRequest,
  SimulationResponse,
  Patient,
  PatientRequest,
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

const transformSimulationResponse = (response: any): SimulationResponse => {
  // The backend returns AllocationResponseDTO: { allocations: List<List<List<RoomAllocationDTO>>>, changes: Int }
  // which maps directly to SimulationResponse — no client-side transformation needed.
  return {
    allocations: response.data.allocations ?? [],
    changes: response.data.changes ?? 0,
  };
};

export const postAllocation = async (allocationRequest: AllocationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/v1/allocation/allocate';
  const response = await axios.post(url, allocationRequest);
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
  const url = completeUrl + '/api/v1/patient-allocations/update-from-allocation';
  await axios.put(url, simulationResponse);
}
