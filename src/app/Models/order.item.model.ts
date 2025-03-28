import { BaseEntity } from './base.entity.model';
import { ProductPackagingBasicInfo } from './product.packaging.model';

export interface OrderItem extends BaseEntity {
  id: number;
  productPackId: number;
  ProductPackaging: ProductPackagingBasicInfo;
  productQty: number;
  ratePerUnit: number;
}
