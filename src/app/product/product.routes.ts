import { Routes } from '@angular/router';
import { ProductListComponent } from './Product/product-list/product-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { ProductFormComponent } from './Product/produt-form/product-form.component';
import { ViewProductComponent } from './Product/view-product/view-product.component';
import { ProductCategoryListComponent } from './ProductCategory/product-category-list/product-category-list.component';
import { ProductCategoryFormComponent } from './ProductCategory/product-category-form/product-category-form.component';
import { ViewProductCategoryComponent } from './ProductCategory/view-product-category/view-product-category.component';
import { PackagingListComponent } from './packaging/packaging-list/packaging-list.component';
import { PackagingFormComponent } from './packaging/packaging-form/packaging-form.component';
import { ViewPackagingComponent } from './packaging/view-packaging/view-packaging.component';
import { ProductPackagingListComponent } from './ProductPackaging/product-packaging-list/product-packaging-list.component';
import { ProductPackagingFormComponent } from './ProductPackaging/product-packaging-form/product-packaging-form.component';
import { ViewProductPackagingComponent } from './ProductPackaging/view-product-packaging/view-product-packaging.component';

export const productRoutes: Routes = [
  {
    path: 'product/product-list',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductList',
        permission: 'View',
      },
    },
  },
  {
    path: 'product/add-product',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductList',
        permission: 'Add',
      },
    },
  },
  {
    path: 'product/edit-product/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductList',
        permission: 'Update',
      },
    },
  },
  {
    path: 'product/view-product/:id',
    component: ViewProductComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductList',
        permission: 'View',
      },
    },
  },
  {
    path: 'product-category/category-list',
    component: ProductCategoryListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductCategories',
        permission: 'View',
      },
    },
  },
  {
    path: 'product-category/add-category',
    component: ProductCategoryFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductCategories',
        permission: 'Add',
      },
    },
  },
  {
    path: 'product-category/edit-category/:id',
    component: ProductCategoryFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductCategories',
        permission: 'Update',
      },
    },
  },
  {
    path: 'product-category/view-category/:id',
    component: ViewProductCategoryComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductCategories',
        permission: 'View',
      },
    },
  },

  {
    path: 'packaging/packaging-list',
    component: PackagingListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'Packaging',
        permission: 'View',
      },
    },
  },
  {
    path: 'packaging/add-packaging',
    component: PackagingFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'Packaging',
        permission: 'Add',
      },
    },
  },
  {
    path: 'packaging/edit-packaging/:id',
    component: PackagingFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'Packaging',
        permission: 'Update',
      },
    },
  },
  {
    path: 'packaging/view-packaging/:id',
    component: ViewPackagingComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'Packaging',
        permission: 'View',
      },
    },
  },
  {
    path: 'product-packaging/list',
    component: ProductPackagingListComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductPackaging',
        permission: 'View',
      },
    },
  },
  {
    path: 'product-packaging/add',
    component: ProductPackagingFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductPackaging',
        permission: 'Add',
      },
    },
  },
  {
    path: 'product-packaging/edit/:id',
    component: ProductPackagingFormComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductPackaging',
        permission: 'Update',
      },
    },
  },
  {
    path: 'product-packaging/view/:id',
    component: ViewProductPackagingComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPermission: {
        module: 'Product',
        subModule: 'ProductPackaging',
        permission: 'View',
      },
    },
  },
];
