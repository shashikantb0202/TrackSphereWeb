import { BasicInfoBaseEntity } from "../Models/base.entity.model";

export function mapApiToBasicInfoBaseEntity(apiData: any): any {

    if (!apiData) {
        console.warn('mapApiToBasicInfoBaseEntity: Received null or undefined data');
        return {}; // Return an empty object or handle the error gracefully
    }

    return {
        id: apiData.id || 0,            // Default value or fallback
        name: apiData.name || '',
        description: apiData.description || ''
    };
}
export function enumToStringArray<T>(enumObj: T): string[] {
    return Object.keys(enumObj!).filter(key => isNaN(Number(key)));
}
