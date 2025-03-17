export interface UserPermission {
    id: number;
    userId: number;
    user: User;
    moduleId: number;
    module: Module;
    subModuleId: number;
    subModule: SubModule;
    permissionId: number;
    permission: Permission;
}

export interface User {
    id: number;
    userName: string;
}

export interface Module {
    id: number;
    name: string;
    priority: number;
    title: string;
    url: string;
    icon: string;
    subModules: SubModule[]; 
}

export interface SubModule {
    id: number;
    name: string;
    icon: string;
    priority: number;
    title?: string;
    url?: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    status: string;
}
