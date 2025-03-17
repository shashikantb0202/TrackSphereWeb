export const STORAGE_KEYS = {
    USER_PERMISSIONS: 'userPermissions',
    AUTH_TOKEN: 'token',
    USER_INFO: 'data',
  };


  export const BaseUrl = {
    Role:{
      Role: '/api/role',
    },
    RolePermissions:{
      RolePermissions: '/api/RolePermission/role',
      BulkUpdateRolePermissions: '/api/RolePermission/groupupdate'

    }
   
  };