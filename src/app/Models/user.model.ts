import { BaseEntity } from './base.entity.model';
import {
  DepartmentBasicInfo,
  DesignationBasicInfo,
  LocationBasicInfo,
} from './common.model';
import { Role } from './Role';

export interface UserBasicInfo {
  id: number;
  username: string;
  name: string;
}
export interface User extends BaseEntity {
  id: number;
  username: string;
  name: string;
  lastName: string;
  contactNo: string;
  email: string;
  workEmail?: string;
  empCode: string;
  designation: DesignationBasicInfo;
  department: DepartmentBasicInfo;
  country: LocationBasicInfo;
  state: LocationBasicInfo;
  city: LocationBasicInfo;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  role: Role;
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
