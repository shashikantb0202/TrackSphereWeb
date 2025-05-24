export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T;
    totalRecords: number;
  };
}
