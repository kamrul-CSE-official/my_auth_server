/*
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// Define custom log format
const myFormat = format.printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${date} ${hour} ${minute} [${label}] ${level}: ${message}`;
});

// Define common options for both loggers
type LoggerOptions = {
  level: string;
  format: any; // Define appropriate type for format
  transports: any[]; // Define appropriate type for transports
};

const commonOptions: LoggerOptions = {
  level: "info",
  format: format.combine(
    format.label({ label: "ukil-saheb" }),
    format.timestamp(),
    myFormat,
    format.prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "15m",
      maxFiles: "7d",
      filename: getLogFilePath("success"),
    }),
  ],
};

// Configure main logger
const logger = createLogger(commonOptions);

// Configure error logger
const errorLoggerOptions: LoggerOptions = {
  ...commonOptions,
  level: "error",
  transports: [
    ...commonOptions.transports,
    new DailyRotateFile({
      ...commonOptions,
      filename: getLogFilePath("error"),
    }),
  ],
};
const errorLogger = createLogger(errorLoggerOptions);

// Utility function to generate log file path
function getLogFilePath(logType: string): string {
  return path.join(
    process.cwd(),
    "loggers",
    "winston",
    logType === "success" ? "successes" : "errors",
    `realChat-%DATE%-${logType}.log`,
  );
}

export { logger, errorLogger };
*/
