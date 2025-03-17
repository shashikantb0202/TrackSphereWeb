export interface Designation {
    id: number;
    name: string;
  }
  
  export interface Department {
    id: number;
    name: string;
  }
  
  export interface Country {
    id: number;
    name: string;
  }
  
  export interface State {
    id: number;
    name: string;
  }
  
  export interface City {
    id: number;
    name: string;
  }
  
  export interface Role {
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
    workEmail: string;
    empCode: string;
    designation: Designation;
    department: Department;
    country: Country;
    state: State;
    city: City;
    role: Role;
    organization?: any;
    createdBy?: any;
    updatedBy?: any;
    createdOn: string;
    updatedOn: string;
  }
  
  