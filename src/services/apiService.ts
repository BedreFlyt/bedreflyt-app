import axios from 'axios';
import {
  SimulationRequest,
  MultiSimulationRequest,
  SimulationResponse,
  DayAllocation,
  Patient,
  PatientRequest
} from '../types/types.ts';

const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds
const completeUrl = process.env.COMPLETE_URL || 'http://localhost:8090';

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

export const getPatientAllocationData = () => {
  const url = completeUrl + '/api/v1/patient-allocations';
  return fetchData(url);
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
  const allocations = response.data.allocations.slice(1).map((dayAllocation: any[]) => {
    const transformedDay: DayAllocation = {};

    // Process all rooms in the day allocation
    dayAllocation.forEach((roomContainer: any, index: number) => {
      // Ensure roomContainer is valid and has at least one key
      if (roomContainer && Object.keys(roomContainer).length > 0) {
        const roomKey = Object.keys(roomContainer)[0];
        const roomObj = roomContainer[roomKey];

        // Ensure roomObj is not null or undefined
        if (roomObj) {
          transformedDay[roomKey] = {
            gender: roomObj.patients && roomObj.patients.length > 0 ? roomObj.gender || "Unknown" : "",
            patients: roomObj.patients || []
          };
        } else {
          console.warn(`Room object is null for roomKey: ${roomKey}`);
        }
      } else {
        console.warn(`Invalid roomContainer at index ${index}:`, roomContainer);
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
