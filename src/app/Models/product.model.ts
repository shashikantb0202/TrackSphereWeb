export interface Product {
    id: number;
    name: string;
    productCategoryId: number;
    productCategory: ProductCategory;
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
}

export interface ProductCategory {
    id: number;
    name: string;
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
