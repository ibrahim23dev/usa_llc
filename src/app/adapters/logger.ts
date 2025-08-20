import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import LokiTransport from "winston-loki"; // Import LokiTransport for integration
import config from "../../config";
const { combine, timestamp, label, printf } = format;
/*   const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  }; */
const myFormat = printf(({ level, message, label, timestamp, stack }) => {
  const date = new Date(timestamp as string | number | Date);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedDate = `${date.toDateString()}-->${hour}:${minutes}:${seconds}`;
  return `${formattedDate}--> [${label}] ${level}: ${stack || message}`;
});
const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: (config.projectName as string) || "my-app" }),
    timestamp(),
    format.errors({ stack: true }), // Enables stack trace logging
    myFormat,
  ),
  // defaultMeta: { service: 'user-service' },
  /*  transports: [
    new transports.Console(),
    // logger/winston/success.log  --> success.log নাম এসে একটা ফাইল ক্রিয়েট করবে
    new transports.File({
      filename: path.join(process.cwd(), 'logger', 'winston', 'success.log'),
      level: 'info',
    }),
  ], */
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "logger",
        "winston",
        "successes",
        "PHU-%DATE%-success.log",
      ),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new LokiTransport({
      host:
        (config.serverMonitor.lokiServer as string) || "http://localhost:3100", // Replace with your Loki server address
      labels: {
        app: (config.projectName as string) || "my-app",
        env: "production",
      }, // Customize as needed
      json: true,
      format: format.json(),
    }),
  ],
});

const errorLogger = createLogger({
  level: "error",
  format: combine(
    label({ label: (config.projectName as string) || "my-app" }),
    timestamp(),
    myFormat,
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "logger",
        "winston",
        "errors",
        "PHU-%DATE%-error.log",
        //%DATE%  -->এটা দ্বারা বোঝানো হয়েছে এইখানে ডেটটা চলে আসবে
      ),
      // datePattern: 'YYYY-MM-DD-HH', // যদি প্রতি ঘন্টায় ঘন্টায় অ্যারোর মেসেজ প্রিন্ট করতে চাই একটা নির্দিষ্ট পাইলে
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new LokiTransport({
      host:
        (config.serverMonitor.lokiServer as string) || "http://localhost:3100", // Replace with your Loki server address
      labels: {
        app: (config.projectName as string) || "my-app",
        env: "production",
        level: "error",
      }, // Error-specific labels
      json: true,
      format: format.json(),
    }),
  ],
});

export { errorLogger, logger };

// import path from 'path';
// import { createLogger, format, transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
// const { combine, timestamp, label, printf } = format;
// /*   const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
//   }; */
// const myFormat = printf(({ level, message, label, timestamp }) => {
//   const date = new Date(timestamp);
//   const hour = date.getHours();
//   const minutes = date.getMinutes();
//   const secound = date.getSeconds();
//   return `${date.toDateString()}-->${hour}:${minutes}:${secound}--> [${label}] ${level}: ${message}`;
// });
// const logger = createLogger({
//   level: 'info',
//   format: combine(label({ label: 'LOGGER' }), timestamp(), myFormat),
//   // defaultMeta: { service: 'user-service' },
//   /*  transports: [
//     new transports.Console(),
//     // logger/winston/success.log  --> success.log নাম এসে একটা ফাইল ক্রিয়েট করবে
//     new transports.File({
//       filename: path.join(process.cwd(), 'logger', 'winston', 'success.log'),
//       level: 'info',
//     }),
//   ], */
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: path.join(
//         process.cwd(),
//         'logger',
//         'winston',
//         'successes',
//         'PHU-%DATE%-success.log',
//       ),
//       datePattern: 'YYYY-MM-DD-HH',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '14d',
//     }),
//   ],
// });

// const errorLogger = createLogger({
//   level: 'error',
//   format: combine(label({ label: 'PH' }), timestamp(), myFormat),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: path.join(
//         process.cwd(),
//         'logger',
//         'winston',
//         'errors',
//         'PHU-%DATE%-error.log',
//         //%DATE%  -->এটা দ্বারা বোঝানো হয়েছে এইখানে ডেটটা চলে আসবে
//       ),
//       // datePattern: 'YYYY-MM-DD-HH', // যদি প্রতি ঘন্টায় ঘন্টায় অ্যারোর মেসেজ প্রিন্ট করতে চাই একটা নির্দিষ্ট পাইলে
//       datePattern: 'YYYY-MM-DD-HH',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '14d',
//     }),
//   ],
// });

// export { errorLogger, logger };
