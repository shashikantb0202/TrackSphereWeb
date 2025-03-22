import { StatusEnum } from '../enums/status.enum';
import {
  ProductCategory,
  ProductCategoryBasicInfo,
} from './Product.category.model';

export interface Product {
  id: number;
  name: string;
  productCategoryId: number;
  productCategory: ProductCategoryBasicInfo;
  images: ProductImage[];
  hsCode: string;
  gstPer: number;
  description: string;
  benefits: string;
  howToUse: string;
  youtubeLink: string;
  returnPolicy: string;
  createdBy: number;
  updatedBy?: number | null;
  createdByUser?: { id: number; name: string } | null;
  updatedByUser?: { id: number; name: string } | null;
  createdOn: string;
  updatedOn?: string;
  status: StatusEnum;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
  errors: any[];
  totalRecords: number;
}
