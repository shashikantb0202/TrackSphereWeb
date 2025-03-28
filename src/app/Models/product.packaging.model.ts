import { BaseEntity } from './base.entity.model';
import { PackagingBasicInfo } from './packaging.model';
import { ProductBasicInfo } from './product.model';

export interface ProductPackagingBasicInfo {
  productPackName: string;
  id: number;
}

export interface ProductPackaging extends BaseEntity {
  productPackName: string;
  packaging: PackagingBasicInfo;
  mrp: number;
  dPrice: number;
  pPrice: number;
  minSalePrice: number;
  maxSalePrice: number;
  minOrderQty: number;
  product: ProductBasicInfo;
}
