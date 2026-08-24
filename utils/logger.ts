import winston from 'winston';

/*
 * Log levels are optionally configured in the .env file. By default it is set to info.
 * Selecting info logs info, warn, and error level logs. Other available log levels are:
 * error   - Critical errors that require attention
 * warn    - Potential problems or unexpected situations
 * info    - General information about test execution
 * http    - HTTP request and response information
 * verbose - More detailed information about test execution
 * debug   - Detailed information useful for troubleshooting
 * silly   - Extremely detailed information for deep debugging
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console()
    ],
});

export default logger;