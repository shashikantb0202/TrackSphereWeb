import { StatusEnum } from "../enums/status.enum";
import { Role } from "../Models/role.model";
import { mapApiToBasicInfoBaseEntity } from "./common.utils";

export function formatRoleName(name: string): string {
    return name.trim().toUpperCase();
  }
  

export function mapApiToRole(apiData: any): Role {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    createdBy:mapApiToBasicInfoBaseEntity(apiData?.createdBy),
    createdOn:new Date( apiData.createdOn),
    status:apiData.status as StatusEnum || StatusEnum.Null
  };
}


