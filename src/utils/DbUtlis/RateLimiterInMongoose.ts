/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { errorLogger, logger } from "../../app/share/logger";
import config from "../../config";
export const rateLimiterMiddlewareMongodb = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //@ts-ignore
  if (mongoose.connection) {
    const opts = {
      //@ts-ignore
      storeClient: mongoose.connection,
      points: 30, // Number of points
      duration: 5, // Per second(s)
    };
    const rateLimiterMongo = new RateLimiterMongo(opts);
    rateLimiterMongo
      //@ts-ignore
      .consume(req?.ip) // consume 2 points
      .then(rateLimiterRes => {
        // 2 points consumed

        next();
      })
      .catch(rateLimiterRes => {
        if (config.env === "production") {
          errorLogger.error("rateLimiterRes", rateLimiterRes);
        } else {
          console.log(rateLimiterRes);
        }
        // Not enough points to consume
        return res
          .status(429)
          .send({ success: false, message: "Too Many Requests" });
      });
  } else {
    next();
  }
};
