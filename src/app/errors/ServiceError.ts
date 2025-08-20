//error make custom
class ServiceError extends Error {
  statusCode: number;
  errorMessage: any[] | undefined;
  constructor(error: any) {
    super(error?.data?.message || error?.message || "Something went wrong");
    this.statusCode = error?.data?.status || error?.status || 500;
    this.errorMessage = error?.data?.errorMessage || error?.errorMessage || [];

    if (error?.data?.stack || error?.stack) {
      this.stack = error?.data?.stack || error?.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ServiceError;
