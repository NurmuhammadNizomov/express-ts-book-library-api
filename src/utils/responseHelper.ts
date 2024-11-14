import { Response } from "express";

// This function handles success responses
export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  data: any,
  message: string,
  pagination?: { page: number; limit: number; totalPages: number; totalCount: number }
) => {
  return res.status(statusCode).json({
    status: "success",
    data,
    message,
    error: null,
    status_code: statusCode,
    timestamp: new Date().toISOString(),
    pagination, 
  });
};


// This function handles error responses
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errorCode: string = "UNKNOWN_ERROR",
  details: string | null = null
) => {
  return res.status(statusCode).json({
    status: "error",
    data: null,
    message,
    status_code: statusCode,
    error: {
      code: errorCode,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  });
};
