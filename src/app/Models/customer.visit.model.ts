import { BaseEntity } from './base.entity.model';
import { Customer, CustomerBasicInfo } from './customer.model';
import { User, UserBasicInfo } from './user.model';

export interface CustomerVisit extends BaseEntity {
  id: number;
  user: UserBasicInfo;
  customer: Customer;
  visitDate: string; // ISO string format (e.g., "2025-03-02T10:00:00")
  latitude: number;
  longitude: number;
  customerVisitType: CustomerVisitType;
  reason: string;
  revisitDate: string; // ISO string format (e.g., "2025-04-10T14:00:00")
  isDeleted: boolean;
  organizationId: number;
  images: VisitImage[];
}

export interface CustomerVisitType {
  id: number;
  name: string;
}

export interface VisitImage {
  id: number;
  imageUrl: string;
}
