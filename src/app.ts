/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

// create xss-clean.d.ts file after work this xss
// import xss from 'xss-clean';
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandeler";
//import routers from "./app/routes/index_route";
//-------------configuring i18next----------
import geoip from "geoip-lite";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import requestIp from "request-ip";
//----------------------------------------
//
import promClient from "prom-client";
import responseTime from "response-time";
//

import { GeoLocation } from "./app/interface";
//import file_route from "./app/routes/file_route";
import { logger } from "./app/adapters/logger";
import config from "./config";
import corsOptions from "./config/corsOptions";
import helmetConfig from "./config/htmlConfig";
import { TestFile } from "./test";
import { rateLimiterRedisMiddleware } from "./utils/DbUtlis/RateLimiterInRedis";

const app: Application = express();

app.use(helmetConfig);
// app.set("trust proxy", true);
// ✅ CORS configuration
app.use(cors(corsOptions));

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });
const reqResTime = new promClient.Histogram({
  name: "request_response_time",
  help: "Request-response time in milliseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000, 3000, 5000, 10000],
});
const totalReqCounter = new promClient.Counter({
  name: "total_requests_counter",
  help: "Total requests",
});
app.use(
  responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: req.statusCode,
      })
      .observe(time);
  }),
);

// app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const clientIp = requestIp.getClientIp(req) || "::1";
  req.clientIp = clientIp;
  const geo = geoip.lookup(req.clientIp) as GeoLocation | null;
  req.auditInfo = {
    ip_address: req.clientIp,
    user_agent: req.headers["user-agent"] || "unknown",
    geo_location: geo,
  };
  //@remove-on-prod
  if (config.env == "development" && req.method !== "GET") {
    // Prepare detailed request log
    const logDetails = {
      method: req.method,
      url: req.originalUrl,
      ip: clientIp,
      headers: req.headers,
      user_agent: req.auditInfo?.user_agent,
      location: geo
        ? `${geo.city ?? "unknown"}, ${geo.country ?? "unknown"}`
        : "unknown",
      params: req.params,
      query: req.query,
      body: req.body,
    };
    logger.info(`Incoming Request: ${JSON.stringify(logDetails, null, 2)}`);
  }

  next();
});

//!-- - some time rate limited is problem my docker compose problem don't use this -->
app.use(rateLimiterRedisMiddleware);
// app.use(rateLimiterMiddlewareMongodb);
// app.use(compression());
// app.use(compression(compressionOptions));

//-------------i18next-- start ---------------
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: "./translation/{{lng}}/translation.json",
      // loadPath: __dirname + '/translation/{{lng}}/translation.json', --> not use __dirname and use (.) ->./translation
    },
    detection: {
      order: ["header"],
      caches: ["cookie"],
    },
    preload: ["en", "fr"],
    fallbackLng: config.api_response_language, // default language en= english
  });
//@ts-ignore
app.use(i18nextMiddleware.handle(i18next));
// ----------- end i18next-------------------

app.set("view engine", "ejs");
app.get("/metrics", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader("Content-Type", promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
  } catch (error) {
    next(error);
  }
});

const waitAndRespond = async function (waitTimeInMilliseconds = 30000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        message: `Waited for ${waitTimeInMilliseconds / 1000} seconds`,
      });
    }, waitTimeInMilliseconds);
  });
};

app.get("/api/v1/server-test", async (req, res, next) => {
  try {
    const query = req.query;
    console.log(req.path);
    if (query.error) {
      const errorMessages = [
        "Unexpected server error occurred.",
        "Something went wrong, please try again later.",
        "Internal server malfunction detected.",
        "Oops! The server encountered an issue.",
        "Server glitch! Please report this incident.",
      ];
      const randomError =
        errorMessages[Math.floor(Math.random() * errorMessages.length)];
      const localDateTime = new Date().toLocaleString();
      throw new Error(`${randomError} - ${localDateTime}`);
    }

    let waitTime;
    if (query.time) {
      waitTime = Number(query.time) * 1000;
    } else {
      waitTime = Math.floor(Math.random() * (3000 - 200 + 1)) + 200; // Random time between 200ms and 5000ms
    }

    const response = await waitAndRespond(waitTime);
    res.send(response);
  } catch (error) {
    next(error);
  }
});
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // res.render('serverCheck.ejs');
    res.send({ message: "server is running...." + process.pid });
  } catch (error) {
    next(error);
  }
});

TestFile();
//Application route
//app.use("/api/v1", routers);
//app.use("/file", file_route.fileRoute);

// global error handlar
app.use(globalErrorHandler);

//handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).send({
    success: false,
    message: "Not found route",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "api not found",
      },
    ],
  });
  next();
});

export default app;
