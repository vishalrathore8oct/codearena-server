class ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 300;
  }
}

export { ApiResponse };
