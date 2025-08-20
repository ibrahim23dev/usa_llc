import { Request } from "express";
import { RedisConnectionServiceOop } from "./services.redies";

export class CacheKeyGenerator {
  readonly baseUrl: string;
  readonly params: Record<string, any> = {};
  constructor(req: Request) {
    // any / to replace : --> /api/v1/users/123 to api:v1:users:123
    const path = req.originalUrl.replace(/\?.*$/, "");
    // this.baseUrl = req.path.replace(/^\/+|\/$/g, '').replace(/\//g, ':');
    this.baseUrl = path.replace(/^\/+|\/$/g, "").replace(/\//g, ":");
    Object.entries(req.query).forEach(([key, value]) => {
      if (value && Boolean(value)) {
        this.params[key] = value;
      }
    });
  }
  public generateSortParams(): string {
    return Object.keys(this.params)
      .sort()
      .map(key => `${key}=${this.params[key]}`)
      .join("&");
  } // api:v1:news:cmbizs93v0013mh8wyow3z7jk:is_home_serial=true
  public generateKey(): string {
    const sortParams = this.generateSortParams();
    return sortParams ? `${this.baseUrl}:${sortParams}` : this.baseUrl;
  }
}

export class RedisCacheResetUtilsOop extends RedisConnectionServiceOop {
  constructor() {
    super();
  }

  async resetCacheByKey(key: string | string[]): Promise<number> {
    return await this.getGlobalRedis().del(
      ...(typeof key === "string" ? [key] : key),
    );
  }
  async resetCacheByAnyPattern(pattern: string, countOrLimit?: number) {
    let cursor = "0";
    const count = countOrLimit || 200; // Reasonable count to balance performance
    let totalDeleted = 0;
    const allKeysToDelete: string[] = [];

    do {
      // Use the SCAN command to find keys
      const [newCursor, foundKeys] = await this.getGlobalRedis().scan(
        cursor,
        "MATCH",
        pattern, // "api:v1:users:*" + "*:userId:*"
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
        //@remove-on-prod
        console.log(`Deleted ${deleteResults} keys in this batch.`);
      }
      totalDeleted = deletedKeys;
    } else {
      //@remove-on-prod
      console.log(`No keys found matching the pattern '${pattern}'.`);
    }
    return totalDeleted;
  }

  async RequestToCacheReset(req: Request): Promise<number> {
    const cacheKeyGenerator = new CacheKeyGenerator(req);
    return await this.getGlobalRedis().del(cacheKeyGenerator.generateKey());
  }
  async flushall() {
    return await this.getGlobalRedis().flushall();
  }
}
