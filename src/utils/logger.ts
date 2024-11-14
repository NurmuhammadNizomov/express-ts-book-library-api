import winston from 'winston';

// Create a custom log format
const logFormat = winston.format.combine(
  winston.format.colorize(),  // Colorize the log output
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: 'info',  // Set default logging level
  format: logFormat, // Apply custom format
  transports: [
    // Log to console
    new winston.transports.Console(),
    // Log to a file (error.log) for error-level logs and above
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Log to a file (combined.log) for all logs at info level and above
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

// You can optionally add additional transports or adjust the logging levels as needed.

export default logger;
