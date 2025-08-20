/* eslint-disable @typescript-eslint/no-unused-vars */
import Redis from "ioredis";
import { ENUM_REDIS_KEY, subscribeArray } from "./consent.redies";
import { redisClient, subRedis } from "./redis";

export class RedisConnectionServiceOop {
  readonly globalRedis: Redis;
  constructor(redis?: Redis) {
    if (redis) {
      this.globalRedis = redis;
    } else {
      this.globalRedis = redisClient;
    }
  }

  // whe you get private property then use getterFunction -> getter method
  getGlobalRedis(): Redis {
    return this.globalRedis;
  }
  async RedisRunFunction() {
    //------------------------redis to all old user key remove---------------
    // deleteAllKeys(ENUM_REDIS_KEY.socket_user + '*')
    //   .then(() => {
    //     console.log('All Redis keys deleted');
    //   })
    //   .catch(err => {
    //     console.error('Error deleting keys:', err);
    //   });
    const res = await redisClient.flushall("ASYNC");
    console.log("🚀RedisRunFunction ~ res:", res);

    //------------------------- delete all keys-----------------------
    const sub = await subRedis.subscribe(...subscribeArray);

    // subRedis.on('message', async (chanel, message) => {
    //   if (chanel === ENUM_REDIS_SUBSCRIBE.socket_message) {
    //     await produceMessageByKafka(message);
    //   }
    // });
  }
}
type KeyInput =
  | { rawKey: string; patternKey?: undefined; limit?: number }
  | { patternKey: string; rawKey?: undefined; limit?: number };
export class RedisAllQueryServiceOop extends RedisConnectionServiceOop {
  constructor(redis?: Redis) {
    if (redis) {
      super(redis);
    } else {
      super();
    }
  }
  async findDataByUserIdAndSocketId(userId: string, socketId: string) {
    const getUsers = await this.getGlobalRedis().get(
      ENUM_REDIS_KEY.socket_user + userId + ":" + socketId,
    );
    return getUsers;
  }
  async findAllSocketsIdsFromUserId(userId: string) {
    let cursor = "0";
    const getUsers: string[] = [];

    do {
      const [newCursor, keys] = await this.getGlobalRedis().scan(
        cursor,
        "MATCH",
        ENUM_REDIS_KEY.socket_user + userId + "*",
        "COUNT",
        50, // You can adjust this count as needed
      );
      cursor = newCursor;

      if (keys.length) {
        const socketIds = keys.map(id => id.split(":")[3]);
        getUsers.push(...socketIds);
      }
    } while (cursor !== "0");

    //console.log('🚀 ~ socket.on ~ getUsers:', getUsers);
    return getUsers;
  }
  async findAllDataByKeyScan(key: string) {
    let cursor = "0";
    const getKeys: string[] = [];

    do {
      const [newCursor, keys] = await this.getGlobalRedis().scan(
        cursor,
        "MATCH",
        key + "*",
        "COUNT",
        50, // You can adjust this count as needed
      );
      cursor = newCursor;

      if (keys.length) {
        getKeys.push(...keys);
      }
    } while (cursor !== "0");

    //console.log('🚀 ~ socket.on ~ getData:', getData);
    const keys = getKeys;

    let getData: (string | null)[] = [];
    if (keys.length) {
      getData = await this.getGlobalRedis().mget(keys);
    }
    return getData;
  }

  async findAnyPatternToAllKeysScan({
    rawKey, // user --> যেকোনো key  এর মধ্যে "user" থাকলে স্ক্যান  করে নেবে
    patternKey, //   "redis:user:*" / "product:*" // "*user"
    limit,
  }: KeyInput) {
    let cursor = "0";
    const getData: string[] = [];

    do {
      const key = patternKey ? patternKey : `*${rawKey}*`;
      // console.log("🚀 ~ RedisAllQueryServiceOop ~ key:", key);
      const [newCursor, keys] = await this.getGlobalRedis().scan(
        cursor,
        "MATCH",
        key, // "*key*" // example: "redis:user:all" / "product:*"
        "COUNT",
        limit || 50, // You can adjust this count as needed
      );
      cursor = newCursor;

      if (keys.length) {
        getData.push(...keys);
      }
    } while (cursor !== "0");

    //console.log('🚀 ~ socket.on ~ getData:', getData);
    return getData;
  }
  async getAnyDataByKey(key: string): Promise<Record<string, any> | null> {
    const getValue = await this.getGlobalRedis().get(key);
    if (typeof getValue === "string") {
      return JSON.parse(getValue);
    } else {
      return getValue;
    }
  }
}
export type IRedisSetter = {
  key: string;
  value: unknown;
  ttl?: number;
}[];
export class RedisAllSetterServiceOop extends RedisConnectionServiceOop {
  constructor(redis?: Redis) {
    if (redis) {
      super(redis);
    } else {
      super();
    }
  }

  // Method to set multiple Redis keys and values using the redisSetter function
  async redisSetter(
    data: IRedisSetter = [],
    ttl = 1 * 60 * 60,
  ): Promise<string[]> {
    try {
      const promises: Promise<string>[] = [];
      data.forEach(value => {
        promises.push(
          this.getGlobalRedis().set(
            value.key,
            typeof value.value !== "string"
              ? JSON.stringify(value.value)
              : value.value,
            "EX",
            value.ttl || ttl,
          ),
        );
      });

      const res = await Promise.all(promises);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async deleteAnyPattern(pattern: string) {
    let cursor = "0";
    const count = 200; // Reasonable count to balance performance
    let totalDeleted = 0;
    const allKeysToDelete: string[] = [];

    do {
      // Use the SCAN command to find keys
      const [newCursor, foundKeys] = await this.getGlobalRedis().scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        count,
      );
      cursor = newCursor;

      if (foundKeys.length > 0) {
        // Collect all the keys to be deleted
        allKeysToDelete.push(...foundKeys);
      }
    } while (cursor !== "0");
    /**
     * @method --> //? const deleteResults = await this.getGlobalRedis().del(...allKeysToDelete);
     * @overload {del(...del)} Using the DEL command with multiple keys (del(...allKeysToDelete)) can be more efficient than issuing individual DEL commands for each key because Redis processes the request for multiple keys in a single round-trip to the server. This is typically faster than sending multiple separate DEL requests, reducing overhead.
    
     */
    if (allKeysToDelete.length > 0) {
      const batchSize = 1000; // Set a reasonable batch size for deletion
      let deletedKeys = 0;

      // Process keys in batches to avoid overwhelming Redis
      for (let i = 0; i < allKeysToDelete.length; i += batchSize) {
        //First, slice the main array into 1000 taka and keep the remaining ones, which means it won't loop 1000 times.
        const batch = allKeysToDelete.slice(i, i + batchSize);
        const deleteResults = await this.getGlobalRedis().del(...batch);
        deletedKeys += deleteResults;
        console.log(`Deleted ${deleteResults} keys in this batch.`);
      }
      totalDeleted = deletedKeys;
    } else {
      console.log(`No keys found matching the pattern '${pattern}'.`);
    }
  }
  async deleteKey(key: string) {
    await this.getGlobalRedis().del(key);
  }
}
