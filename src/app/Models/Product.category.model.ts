import { BaseEntity } from './base.entity.model';

export interface ProductCategoryBasicInfo {
  id: number;
  name: string;
}

export interface ProductCategory extends BaseEntity {
  id: number;
  name: string;
  image: string;
  priority: number;
}
