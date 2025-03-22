import { Role } from './Role';

export interface Designation {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  lastName: string;
  contactNo: string;
  email: string;
  workEmail?: string;
  empCode: string;
  designation: Designation;
  department: Department;
  country: Location;
  state: Location;
  city: Location;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  role: Role;
  organization?: string | null;
  createdBy?: { id: number; name: string } | null;
  updatedBy?: { id: number; name: string } | null;
  createdOn: string;
  updatedOn: string;
  status: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
  errors: any[];
  totalRecords: number;
}

export interface AddUser {
  id?: number;
  name: string;
  lastName: string;
  password: string;
  confirmPassword?: string; // For re-enter password validation only (not sent to API)
  email: string;
  workemail: string;
  username: string;
  contactNo: string;
  empCode: string;
  designationId: number;
  departmentId: number;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  countryId: number;
  stateId: number;
  cityId: number;
  roleId: number;
}
