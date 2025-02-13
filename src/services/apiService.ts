import axios from 'axios';
import { SimulationRequest, MultiSimulationRequest } from '../types/types.ts';

const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds
const baseUrl = process.env.BASE_URL || 'localhost';

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
  const url = 'http://' + baseUrl + ':8090/api/patient/retrieve';
  const response = await axios.get(url);
  return response.data;
};

export const getPatientAllocationData = () => {
  const url = 'http://' + baseUrl + ':8090/api/patient-allocation/retrieve';
  return fetchData(url);
}

export const getTreatmentData = () => {
  const url = 'http://' + baseUrl + ':8090/api/fuseki/treatment/retrieve';
  return fetchData(url);
};

export const getRoomData = () => {
  const url = 'http://' + baseUrl + ':8090/api/fuseki/room/retrieve';
  return fetchData(url);
};

export const getTaskData = () => {
  const url = 'http://' + baseUrl + ':8090/api/fuseki/task/retrieve';
  return fetchData(url);
};

export const getDiagnosisData = () => {
  const url = 'http://' + baseUrl + ':8090/api/fuseki/diagnosis/retrieve';
  return fetchData(url);
}

export const postSimulationScenario = (simulationRequest: SimulationRequest) => {
  const url = 'http://' + baseUrl + ':8090/api/simulation/simulate';
  return axios.post(url, simulationRequest);
}

export const postSimulationScenarioGlobal = (simulationRequest: SimulationRequest) => {
  const url = 'http://' + baseUrl + ':8090/api/simulation/simulate-global';
  return axios.post(url, simulationRequest);
}

export const postMultiSimulationScenario = (simulationRequest: MultiSimulationRequest) => {
  const url = 'http://' + baseUrl + ':8090/api/simulation/simulate-many';
  return axios.post(url, simulationRequest);
}
