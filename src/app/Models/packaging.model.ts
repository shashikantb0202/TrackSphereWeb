export interface PackagingBasicInfo {
  id: number;
  name: string;
}

export interface Packaging {
  id: number;
  name: string;
  unitId: number;
  unit: Unit;
  createdBy?: { id: number; name: string } | null;
  updatedBy?: { id: number; name: string } | null;
  createdOn: string;
  updatedOn: string;
  status: string;
}

export interface Unit {
  id: number;
  name: string;
}
