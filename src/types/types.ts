export type Patient = {
  patientId: string;
  patientName: string;
  patientSurname: string;
  patientAddress: string;
  city: string;
  patientBirthdate: string | null; // LocalDateTime can be represented as a string in ISO format
  gender: string;
}

export type PatientAllocation = {
  id: number;
  patientId: Patient;
  acute: boolean;
  diagnosisCode: string;
  diagnosisName: string;
  acuteCategory: number;
  careCategory: number;
  monitoringCategory: number;
  careId: number;
  contagious: boolean;
  wardName: string;
  hospitalCode: string;
  roomNumber: number;
  dueDate: string | null; // LocalDateTime can be represented as a string in ISO format
  simulated: boolean;
}

export const patientAllocationColumns = [
  { header: "Patient", accessor: "patientId" },
  { header: "Diagnosis Code", accessor: "diagnosisCode" },
  { header: "Ward Name", accessor: "wardName" },
  { header: "Hospital Code", accessor: "hospitalCode" },
  { header: "Room Number", accessor: "roomNumber" },
  { header: "Due Date", accessor: "dueDate" }
]

export type PatientRequest = {
  patientName: string;
  patientSurname: string;
  patientAddress: string;
  city: string;
  patientBirthdate: string | null; // LocalDateTime can be represented as a string in ISO format
  gender: string;
}

export const patientColumns = [
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
  wardName: string;
  hospitalCode: string;
}

export type AllocationRequest = {
  scenario: ScenarioRequest[];
  mode: string;
  smtMode?: string;
  wardName: string;
  hospitalCode: string;
  adaptive: boolean;
}

export type MultiSimulationRequest = {
  scenario: ScenarioRequest[];
  repetitions: number;
  risk: number;
  smtMode: string;
  wardName: string;
  hospitalCode: string;
}

export type WardRoom = {
  patients: Patient[];
  gender: string;
  roomDetails: Room;
}

export type DayAllocation = {
  [key: string]: WardRoom;
}

export type RoomAllocationDTO = {
  roomNumber: number;
  wardName: string;
  hospitalCode: string;
  patients: Patient[];
  gender: string;
}

export type AllocationResponse = SimulationResponse;

export type SimulationResponse = {
  allocations: RoomAllocationDTO[][][];
  changes: number;
}

// ──────────────────────────────────────────────
// Supply / Order types (SBL service)
// ──────────────────────────────────────────────

export type InventoryItem = {
  id: number | null;
  date: string | null;           // LocalDate → ISO string
  itemId: number;
  itemType: string;
  itemName: string;
  currentStock: number;
  minRequired: number;
  maxCapacity: number;
  unitCost: number;
  avgUsagePerDay: number;
  restockLeadTime: number;
  vendorId: string;
}

export type Order = {
  id: number | null;
  inventoryItem: InventoryItem;
  numberToOrder: number;
  createdAt: string;             // LocalDateTime → ISO string
}

export const orderColumns = [
  { header: "ID",             accessor: "id" },
  { header: "Item Name",      accessor: "inventoryItem.itemName" },
  { header: "Item Type",      accessor: "inventoryItem.itemType" },
  { header: "Qty to Order",   accessor: "numberToOrder" },
  { header: "Created At",     accessor: "createdAt" },
]

// Notification event pushed by the supplies.order Kafka topic
export type SupplyOrderEvent = {
  id: string;                    // unique client-side id
  payload: Order;
  receivedAt: string;            // ISO timestamp
  read: boolean;
}
