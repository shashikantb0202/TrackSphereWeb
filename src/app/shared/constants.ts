export const STORAGE_KEYS = {
    USER_PERMISSIONS: 'userPermissions',
    AUTH_TOKEN: 'token',
    USER_INFO: 'data',
  };


  export const BaseUrl = {
    Role:{
      Role: '/api/role'
    },
    User:{
      User: '/api/user',
      UserRole: '/api/user/Role'
    },
    RolePermissions:{
      RolePermissions: '/api/RolePermission/role',
      BulkUpdateRolePermissions: '/api/RolePermission/groupupdate'
    },
    UserPermissions:{
      UserPermissions: '/api/UserPermission/user',
      UserPermissiongroup: '/api/UserPermission/permissiongroup',
      BulkUpdateUserPermissions: '/api/UserPermission/groupupdate'
    }
   
  };