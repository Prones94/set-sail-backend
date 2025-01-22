const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, errors, colorize, printf } = format;

// Custom log format for better readability
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create the logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Use readable timestamp
    errors({ stack: true }), // Include stack trace for errors
    prettyPrint(), // Format logs nicely for JSON output
    colorize(), // Colorize log levels (useful for console)
    logFormat // Use custom format
  ),
  transports: [
    // Log to the console for development
    new transports.Console({
      format: combine(
        colorize(), // Colorize log levels in console
        logFormat // Custom format for console logs
      ),
    }),

    // Log errors to a separate file
    new transports.File({
      filename: 'logs/error.log',
      level: 'error', // Only log errors
    }),

    // Log all levels to a combined file
    new transports.File({
      filename: 'logs/combined.log',
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger;
