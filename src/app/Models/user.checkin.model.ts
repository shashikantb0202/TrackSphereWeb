export interface FileInfo {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

export interface UserCheckIn {
  id: number;
  userId: number;
  user: any | null;
  travelledBy: string;
  checkInKmReading: number;
  route: string;
  checkInImageFileId: number;
  checkInImageFile: FileInfo;
  checkOutKmReading: number;
  checkOutImageFileId: number;
  checkOutImageFile: FileInfo;
  checkOutDateTime: string;
  checkInDateTime: string;
  createdBy: number;
  createdByUser: any | null;
  updatedBy: number;
  updatedByUser: any | null;
  createdOn: string;
  updatedOn: string;
  checkInLatitude: number;
  checkInLongitude: number;
  checkOutLatitude: number;
  checkOutLongitude: number;
}

export interface UserCheckInResponse {
  data: {
    data: UserCheckIn[];
    totalRecords: number;
  };
}
