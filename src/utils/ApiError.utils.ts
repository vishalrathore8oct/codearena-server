class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: unknown[];
  data: null;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: unknown[] | unknown = [],
    stack?: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
