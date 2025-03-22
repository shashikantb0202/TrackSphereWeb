export const STORAGE_KEYS = {
  USER_PERMISSIONS: 'userPermissions',
  AUTH_TOKEN: 'token',
  USER_INFO: 'data',
};

export const BaseUrl = {
  Role: {
    Role: '/api/role',
  },
  User: {
    User: '/api/user',
    UserAll: '/api/user/all',
    UserWithFilter: '/api/user/filter',
    UserRole: '/api/user/Role',
  },
  Product: {
    Product: '/api/product',
    ProductAll: '/api/Product/all',
    ProductWithFilter: '/api/Product/filter',
  },
  ProductCategory: {
    ProductCategory: '/api/productCategory',
    ProductCategoryAll: '/api/productCategory/all',
    ProductCategoryWithFilter: '/api/productCategory/filter',
  },
  Packaging: {
    Packaging: '/api/Packaging',
    PackagingAll: '/api/Packaging',
    PackagingWithFilter: '/api/Packaging/filter',
  },
  Unit: {
    Unit: '/api/Unit',
  },
  GeoLocation: {
    GeoLocation: '/api/GeoLocation',
  },
  RolePermissions: {
    RolePermissions: '/api/RolePermission/role',
    BulkUpdateRolePermissions: '/api/RolePermission/groupupdate',
  },
  UserPermissions: {
    UserPermissions: '/api/UserPermission/user',
    UserPermissiongroup: '/api/UserPermission/permissiongroup',
    BulkUpdateUserPermissions: '/api/UserPermission/groupupdate',
  },
};
