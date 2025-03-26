export type Patient = {
  patientId: string;
  patientName: string;
  patientSurname: string;
  patientAddress: string;
  city: string;
  patientBirthdate: string | null; // LocalDateTime can be represented as a string in ISO format
  gender: string;
}

export type PatientRequest = {
  patientName: string;
  patientSurname: string;
  patientAddress: string;
  city: string;
  patientBirthdate: string | null; // LocalDateTime can be represented as a string in ISO format
  gender: string;
}

export const patientColumns = [
  { header: "ID", accessor: "patientId" },
  { header: "Name", accessor: "patientName" },
  { header: "Surname", accessor: "patientSurname" },
  { header: "Address", accessor: "patientAddress" },
  { header: "City", accessor: "city" },
  { header: "Birthdate", accessor: "patientBirthdate" },
  { header: "Gender" , accessor: "gender" }
]

export type Diagnosis = {
  diagnosisName: string;
}

export const diagnosisColumns = [
  { header: "Diagnosis", accessor: "diagnosisName" }
]

export type MonitoringCategory = {
  category: number;
  description: string;
}

export const monitoringCategoryColumns = [
  { header: "Category", accessor: "category" },
  { header: "Description", accessor: "description" }
]

export type City = {
  cityName: string;
}

export const cityColumns = [
  { header: "City", accessor: "cityName" }
]

export type Floor = {
  floorNumber: number;
}

export const floorColumns = [
  { header: "Floor Number", accessor: "floorNumber" }
]

export type Hospital = {
  hospitalName: string;
  hospitalCode: string;
  hospitalCity: City;
}

export const hospitalColumns = [
  { header: "Hospital Name", accessor: "hospitalName" },
  { header: "Hospital Code", accessor: "hospitalCode" },
  { header: "Hospital City", accessor: "hospitalCity" }
]

export type Ward = {
  wardName: string;
  wardCode: string;
  wardHospital: Hospital;
  wardFloor: Floor;
}

export const wardColumns = [
  { header: "Ward Name", accessor: "wardName" },
  { header: "Ward Code", accessor: "wardCode" },
  { header: "Ward Hospital", accessor: "wardHospital" },
  { header: "Ward Floor", accessor: "wardFloor" }
]

export type Room = {
  roomNumber: number;
  capacity: number;
  treatmentWard: Ward;
  hospital: Hospital;
  monitoringCategory: MonitoringCategory;
  bathroom: boolean
}

export const roomColumns = [
  { header: "Room Number", accessor: "roomNumber" },
  { header: "Capacity", accessor: "capacity" },
  { header: "Treating Ward", accessor: "treatmentWard" },
  { header: "Monitoring Category", accessor: "monitoringCategory" },
  { header: "Bathroom", accessor: "bathroom" }
]

export type Task = {
  taskName: string
}

export const taskColumns = [
  { header: "Task Name", accessor: "taskName" }
]

export type Treatment = {
  treatmentName: string;
  treatmentDescription: string;
  diagnosis: Diagnosis;
  frequency: number;
  weight: number;
  firstTaskName: string;
  lastTaskName: string;
}

export const treatmentColumns = [
  { header: "Treatment Name", accessor: "treatmentName" },
  { header: "Treatment Description", accessor: "treatmentDescription" },
  { header: "Diagnosis", accessor: "diagnosis" },
  { header: "Frequency", accessor: "frequency" },
  { header: "Weight", accessor: "weight" },
  { header: "First Task", accessor: "firstTaskName" },
  { header: "Last Task", accessor: "lastTaskName" }
]

export type ScenarioRequest = {
  batch: number;
  patientId: string;
  diagnosis: string;
}

export type SimulationRequest = {
  scenario: ScenarioRequest[];
  mode: string;
  smtMode?: string;
}

export type MultiSimulationRequest = {
  scenario: ScenarioRequest[];
  repetitions: number;
  risk: number;
  smtMode: string;
}

export type WardRoom = {
  patients: Patient[];
  gender: string;
}

export type DayAllocation = {
  [key: string]: WardRoom;
}

export type SimulationResponse = {
  allocations: DayAllocation[];
  changes: number;
}
