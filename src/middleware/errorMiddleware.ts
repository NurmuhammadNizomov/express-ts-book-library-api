import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError"; 
import logger from "../utils/logger"; 

// Error handling middleware
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode is set
  const message = err.message || "Internal Server Error";
  const errorCode = err.errorCode || "UNKNOWN_ERROR"; // Default to 'UNKNOWN_ERROR'
  const details = err.details || null; // Additional details, if any

  // Log the error details using Winston logger
  logger.error(`[${statusCode}] ${message} - ${errorCode}: ${err.stack || details}`);

  // Send a standardized error response
  res.status(statusCode).json({
    status: "error",
    data: null,
    message,
    error: {
      code: errorCode,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;
