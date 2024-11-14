
export class CustomError extends Error {
    statusCode: number;
    errorCode?: string;
    details?: string;
  
    constructor(statusCode: number, message: string, errorCode?: string, details?: string) {
      super(message);
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      this.details = details;
      this.name = this.constructor.name; // Set the name to 'CustomError'
      Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
}
  