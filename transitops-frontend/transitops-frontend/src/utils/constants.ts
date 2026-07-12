export const VEHICLE_STATUS = [
  "Available",
  "On Trip",
  "In Shop",
  "Retired",
] as const;
export const DRIVER_STATUS = [
  "Available",
  "On Trip",
  "Off Duty",
  "Suspended",
] as const;
export const TRIP_STATUS = [
  "Draft",
  "Dispatched",
  "Completed",
  "Cancelled",
] as const;
export const ROLES = [
  "Fleet Manager",
  "Driver",
  "Safety Officer",
  "Financial Analyst",
] as const;

export type VehicleStatus = (typeof VEHICLE_STATUS)[number];
export type DriverStatus = (typeof DRIVER_STATUS)[number];
export type TripStatus = (typeof TRIP_STATUS)[number];
export type Role = (typeof ROLES)[number];
