import axios from 'axios';

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
      // Optionally, you can implement a strategy to clear old cache items here
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
