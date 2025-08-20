/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from "express";

import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../../app/redis/redis";
import { errorLogger } from "../../app/share/logger";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 100, // Allow 100 requests
  duration: 60, // per 60 seconds (1 minute) single ip
});

export const rateLimiterRedisMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  rateLimiter
    //@ts-ignore
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(err => {
      errorLogger.error(err);
      return res
        .status(429)
        .send({ success: false, message: "Too Many Requests" });
    });
};
