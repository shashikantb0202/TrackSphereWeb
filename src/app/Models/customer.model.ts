import { BaseEntity, BasicInfoBaseEntity } from './base.entity.model';

export interface CustomerBasicInfo {
  id: number;
  name: string;
}
export interface Customer extends BaseEntity {
  id: number;
  name: string;
  customerType: BasicInfoBaseEntity;
  customerTypeId: number;
  contactNo: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  country: BasicInfoBaseEntity;
  countryId: number;
  state: BasicInfoBaseEntity;
  stateId: number;
  city: BasicInfoBaseEntity;
  cityId: number;
  gstNo: string;
  isDeleted: boolean;
  //status: StatusEnum;
}
