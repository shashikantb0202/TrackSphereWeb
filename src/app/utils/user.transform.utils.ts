import { User } from "../Models/user.model";

export function transformToUserModel(data: any): User {
  return {
    id: data.id,
    username: data.username,
    name: data.name,
    lastName: data.lastName,
    contactNo: data.contactNo,
    email: data.email,
    workEmail: data.workEmail,
    addressLine1:data.addressLine1,
    addressLine2:data.addressLine2,
    landmark:data.landmark,
    empCode: data.empCode,
    designation: data.designation ? { ...data.designation } : { id: 0, name: '' },
    department: data.department ? { ...data.department } : { id: 0, name: '' },
    country: data.country ? { ...data.country } : { id: 0, name: '' },
    state: data.state ? { ...data.state } : { id: 0, name: '' },
    city: data.city ? { ...data.city } : { id: 0, name: '' },
    role: data.role ? { ...data.role } : { id: 0, name: '' },
    organization: data.organization || null,
    createdBy: data.createdBy || null,
    updatedBy: data.updatedBy || null,
    createdOn: data.createdOn,
    updatedOn: data.updatedOn,
    status:data.status
  };
}
