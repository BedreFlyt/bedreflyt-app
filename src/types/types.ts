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

export type Room = {
  roomNumber: number;
  roomNumberModel: number;
  roomCategory: number;
  capacity: number;
  bathroom: boolean
}

export const roomColumns = [
  { header: "Room Number", accessor: "roomNumber" },
  { header: "Room Number Model", accessor: "roomNumberModel" },
  { header: "Room Category", accessor: "roomCategory" },
  { header: "Capacity", accessor: "capacity" },
  { header: "Bathroom", accessor: "bathroom" }
]

export type Task = {
  taskName: string;
  averageDuration: number;
  bed: number;
}

export const taskColumns = [
  { header: "Task Name", accessor: "taskName" },
  { header: "Average Duration", accessor: "averageDuration" },
  { header: "Bed", accessor: "bed" }
]

export type Treatment = {
  treatmentId: string;
  diagnosis: string;
  frequency: number;
  weight: number;
}

export const treatmentColumns = [
  { header: "Treatment ID", accessor: "treatmentId" },
  { header: "Diagnosis", accessor: "diagnosis" },
  { header: "Frequency", accessor: "frequency" },
  { header: "Weight", accessor: "weight" }
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
