import axios from 'axios';
import { SimulationRequest, MultiSimulationRequest, SimulationResponse, DayAllocation } from '../types/types.ts';

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

export const getPatientData = async () => {
  const url = completeUrl + '/api/patient/retrieve';
  const response = await axios.get(url);
  return response.data;
};

export const getPatientAllocationData = () => {
  const url = completeUrl + '/api/patient-allocation/retrieve';
  return fetchData(url);
}

export const getTreatmentData = () => {
  const url = completeUrl + '/api/fuseki/treatment/retrieve';
  return fetchData(url);
};

export const getRoomData = () => {
  const url = completeUrl + '/api/fuseki/room/retrieve';
  return fetchData(url);
};

export const getTaskData = () => {
  const url = completeUrl + '/api/fuseki/task/retrieve';
  return fetchData(url);
};

export const getDiagnosisData = () => {
  const url = completeUrl + '/api/fuseki/diagnosis/retrieve';
  return fetchData(url);
}

const transformSimulationResponse = (response: any): SimulationResponse => {
  const allocations = response.data.allocations.slice(1).map((dayAllocation: any[]) => {
    const transformedDay: DayAllocation = {};
    
    // Process all rooms in the day allocation
    dayAllocation.forEach((roomContainer: any, index: number) => {
      // Get the first (and only) key-value pair from the room container
      const roomKey = Object.keys(roomContainer)[0];
      const roomObj = roomContainer[roomKey];
      
      transformedDay[index] = {
        gender: roomObj.gender || "Unknown",
        patients: roomObj.patients || []
      };
    });

    return transformedDay;
  });

  return {
    allocations: allocations,
    changes: response.data.changes || 0
  };
};

export const postSimulationScenario = async (simulationRequest: SimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/simulation/simulate';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}

export const postSimulationScenarioGlobal = async (simulationRequest: SimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/simulation/simulate-global';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}

export const postMultiSimulationScenario = async (simulationRequest: MultiSimulationRequest): Promise<SimulationResponse> => {
  const url = completeUrl + '/api/simulation/simulate-many';
  const response = await axios.post(url, simulationRequest);
  return transformSimulationResponse(response);
}
