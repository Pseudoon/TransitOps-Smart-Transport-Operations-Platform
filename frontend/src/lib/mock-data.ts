// Mock data for TransitOps hackathon prototype.
// Replace with real API when backend is wired.

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";
export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended";
export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

export interface Vehicle {
  id: string;
  regNumber: string;
  name: string;
  type: "Van" | "Truck" | "Trailer" | "Pickup";
  capacityKg: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: "North" | "South" | "East" | "West";
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: "LMV" | "HMV" | "HTV" | "PSV";
  licenseExpiry: string;
  contact: string;
  safetyScore: number;
  status: DriverStatus;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoKg: number;
  distanceKm: number;
  status: TripStatus;
  scheduledAt: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  cost: number;
  openedAt: string;
  closedAt: string | null;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  category: "Toll" | "Parking" | "Permit" | "Other";
  amount: number;
  date: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "V-01",
    regNumber: "MH12AB1234",
    name: "Tata Ace Gold",
    type: "Van",
    capacityKg: 500,
    odometer: 45320,
    acquisitionCost: 620000,
    status: "Available",
    region: "West",
  },
  {
    id: "V-02",
    regNumber: "DL08CD5566",
    name: "Ashok Leyland Dost",
    type: "Van",
    capacityKg: 750,
    odometer: 78210,
    acquisitionCost: 780000,
    status: "On Trip",
    region: "North",
  },
  {
    id: "V-03",
    regNumber: "KA05EF9911",
    name: "Mahindra Bolero Pickup",
    type: "Pickup",
    capacityKg: 1200,
    odometer: 112400,
    acquisitionCost: 940000,
    status: "In Shop",
    region: "South",
  },
  {
    id: "V-04",
    regNumber: "TN22GH3344",
    name: "Eicher Pro 2049",
    type: "Truck",
    capacityKg: 4500,
    odometer: 156700,
    acquisitionCost: 1850000,
    status: "Available",
    region: "South",
  },
  {
    id: "V-05",
    regNumber: "GJ01JK7788",
    name: "BharatBenz 1617R",
    type: "Truck",
    capacityKg: 8000,
    odometer: 92100,
    acquisitionCost: 2450000,
    status: "On Trip",
    region: "West",
  },
  {
    id: "V-06",
    regNumber: "WB02LM4422",
    name: "Volvo FM 420",
    type: "Trailer",
    capacityKg: 25000,
    odometer: 220500,
    acquisitionCost: 5200000,
    status: "Available",
    region: "East",
  },
  {
    id: "V-07",
    regNumber: "MH14NO8899",
    name: "Tata 407 SFC",
    type: "Truck",
    capacityKg: 2500,
    odometer: 66500,
    acquisitionCost: 1150000,
    status: "Retired",
    region: "West",
  },
  {
    id: "V-08",
    regNumber: "UP32PQ1122",
    name: "Mahindra Furio 7",
    type: "Truck",
    capacityKg: 3200,
    odometer: 34500,
    acquisitionCost: 1720000,
    status: "Available",
    region: "North",
  },
];

export const drivers: Driver[] = [
  {
    id: "D-01",
    name: "Alex Rodriguez",
    licenseNumber: "MH1220200011",
    licenseCategory: "HTV",
    licenseExpiry: "2027-04-12",
    contact: "+91 98200 11111",
    safetyScore: 92,
    status: "Available",
  },
  {
    id: "D-02",
    name: "Priya Sharma",
    licenseNumber: "DL0820180234",
    licenseCategory: "LMV",
    licenseExpiry: "2026-11-30",
    contact: "+91 98111 22222",
    safetyScore: 88,
    status: "On Trip",
  },
  {
    id: "D-03",
    name: "Mohammed Iqbal",
    licenseNumber: "KA0520190098",
    licenseCategory: "HMV",
    licenseExpiry: "2026-03-08",
    contact: "+91 98801 33333",
    safetyScore: 76,
    status: "Off Duty",
  },
  {
    id: "D-04",
    name: "Sunita Reddy",
    licenseNumber: "TN2220210456",
    licenseCategory: "HTV",
    licenseExpiry: "2028-01-25",
    contact: "+91 99001 44444",
    safetyScore: 95,
    status: "Available",
  },
  {
    id: "D-05",
    name: "Rajesh Kumar",
    licenseNumber: "GJ0120170789",
    licenseCategory: "HTV",
    licenseExpiry: "2026-08-14",
    contact: "+91 98240 55555",
    safetyScore: 71,
    status: "On Trip",
  },
  {
    id: "D-06",
    name: "Anita Bose",
    licenseNumber: "WB0220200321",
    licenseCategory: "HMV",
    licenseExpiry: "2027-06-19",
    contact: "+91 98301 66666",
    safetyScore: 90,
    status: "Available",
  },
  {
    id: "D-07",
    name: "Vikram Singh",
    licenseNumber: "UP3220160654",
    licenseCategory: "HTV",
    licenseExpiry: "2025-12-01",
    contact: "+91 98977 77777",
    safetyScore: 65,
    status: "Suspended",
  },
];

export const trips: Trip[] = [
  {
    id: "T-1042",
    source: "Mumbai DC",
    destination: "Pune Hub",
    vehicleId: "V-02",
    driverId: "D-02",
    cargoKg: 620,
    distanceKm: 152,
    status: "Dispatched",
    scheduledAt: "2026-07-12T08:30:00Z",
  },
  {
    id: "T-1041",
    source: "Ahmedabad",
    destination: "Surat",
    vehicleId: "V-05",
    driverId: "D-05",
    cargoKg: 7200,
    distanceKm: 265,
    status: "Dispatched",
    scheduledAt: "2026-07-12T06:00:00Z",
  },
  {
    id: "T-1040",
    source: "Chennai Port",
    destination: "Bangalore",
    vehicleId: "V-04",
    driverId: "D-04",
    cargoKg: 3800,
    distanceKm: 348,
    status: "Completed",
    scheduledAt: "2026-07-11T05:15:00Z",
  },
  {
    id: "T-1039",
    source: "Kolkata",
    destination: "Durgapur",
    vehicleId: "V-06",
    driverId: "D-06",
    cargoKg: 21500,
    distanceKm: 175,
    status: "Completed",
    scheduledAt: "2026-07-10T22:00:00Z",
  },
  {
    id: "T-1038",
    source: "Delhi",
    destination: "Jaipur",
    vehicleId: "V-08",
    driverId: "D-01",
    cargoKg: 2900,
    distanceKm: 281,
    status: "Draft",
    scheduledAt: "2026-07-13T04:30:00Z",
  },
  {
    id: "T-1037",
    source: "Nashik",
    destination: "Mumbai",
    vehicleId: "V-01",
    driverId: "D-01",
    cargoKg: 480,
    distanceKm: 165,
    status: "Cancelled",
    scheduledAt: "2026-07-09T09:00:00Z",
  },
];

export const maintenanceLogs: MaintenanceLog[] = [
  {
    id: "M-201",
    vehicleId: "V-03",
    type: "Engine overhaul",
    cost: 84500,
    openedAt: "2026-07-08",
    closedAt: null,
  },
  {
    id: "M-200",
    vehicleId: "V-04",
    type: "Brake pad replacement",
    cost: 12400,
    openedAt: "2026-07-01",
    closedAt: "2026-07-02",
  },
  {
    id: "M-199",
    vehicleId: "V-05",
    type: "Oil change & filter",
    cost: 6200,
    openedAt: "2026-06-24",
    closedAt: "2026-06-24",
  },
  {
    id: "M-198",
    vehicleId: "V-06",
    type: "Tyre rotation",
    cost: 3800,
    openedAt: "2026-06-15",
    closedAt: "2026-06-15",
  },
];

export const fuelLogs: FuelLog[] = [
  {
    id: "F-501",
    vehicleId: "V-02",
    liters: 45,
    cost: 4680,
    date: "2026-07-11",
  },
  {
    id: "F-502",
    vehicleId: "V-05",
    liters: 120,
    cost: 12480,
    date: "2026-07-11",
  },
  {
    id: "F-503",
    vehicleId: "V-04",
    liters: 85,
    cost: 8840,
    date: "2026-07-10",
  },
  {
    id: "F-504",
    vehicleId: "V-06",
    liters: 210,
    cost: 21840,
    date: "2026-07-10",
  },
  {
    id: "F-505",
    vehicleId: "V-01",
    liters: 32,
    cost: 3328,
    date: "2026-07-09",
  },
  {
    id: "F-506",
    vehicleId: "V-08",
    liters: 68,
    cost: 7072,
    date: "2026-07-09",
  },
];

export const expenses: Expense[] = [
  {
    id: "E-301",
    vehicleId: "V-02",
    category: "Toll",
    amount: 620,
    date: "2026-07-11",
  },
  {
    id: "E-302",
    vehicleId: "V-05",
    category: "Toll",
    amount: 1420,
    date: "2026-07-11",
  },
  {
    id: "E-303",
    vehicleId: "V-04",
    category: "Parking",
    amount: 300,
    date: "2026-07-10",
  },
  {
    id: "E-304",
    vehicleId: "V-06",
    category: "Permit",
    amount: 4500,
    date: "2026-07-10",
  },
  {
    id: "E-305",
    vehicleId: "V-08",
    category: "Toll",
    amount: 780,
    date: "2026-07-09",
  },
];

// Aggregated KPIs
export function computeKpis() {
  const total = vehicles.length;
  const available = vehicles.filter((v) => v.status === "Available").length;
  const onTrip = vehicles.filter((v) => v.status === "On Trip").length;
  const inShop = vehicles.filter((v) => v.status === "In Shop").length;
  const activeTrips = trips.filter((t) => t.status === "Dispatched").length;
  const pendingTrips = trips.filter((t) => t.status === "Draft").length;
  const driversOnDuty = drivers.filter(
    (d) => d.status === "On Trip" || d.status === "Available",
  ).length;
  const utilization = Math.round(
    (onTrip /
      Math.max(
        total - vehicles.filter((v) => v.status === "Retired").length,
        1,
      )) *
      100,
  );
  return {
    total,
    available,
    onTrip,
    inShop,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    utilization,
  };
}

export const utilizationTrend = [
  { day: "Mon", utilization: 58, trips: 12 },
  { day: "Tue", utilization: 64, trips: 15 },
  { day: "Wed", utilization: 71, trips: 18 },
  { day: "Thu", utilization: 68, trips: 17 },
  { day: "Fri", utilization: 76, trips: 22 },
  { day: "Sat", utilization: 82, trips: 24 },
  { day: "Sun", utilization: 55, trips: 9 },
];

export const costBreakdown = [
  { name: "Fuel", value: 58540 },
  { name: "Maintenance", value: 106900 },
  { name: "Tolls & Permits", value: 7620 },
  { name: "Other", value: 3200 },
];

export const fleetByType = [
  { type: "Van", count: vehicles.filter((v) => v.type === "Van").length },
  { type: "Pickup", count: vehicles.filter((v) => v.type === "Pickup").length },
  { type: "Truck", count: vehicles.filter((v) => v.type === "Truck").length },
  {
    type: "Trailer",
    count: vehicles.filter((v) => v.type === "Trailer").length,
  },
];
