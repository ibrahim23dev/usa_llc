//import { } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";





export type PrismaActionArgsMap<T = unknown> = {
  findUnique: { where: Record<string,unknown> };
  findFirst: {
    where?: Record<string,unknown>;
    orderBy?: Record<string,unknown> | Record<string,unknown>[];
    skip?: number;
    take?: number;
    cursor?: Record<string,unknown>;
    distinct?: string[];
  };
  findMany: {
    where?: Record<string,unknown>;
    orderBy?: Record<string,unknown> | Record<string,unknown>[];
    skip?: number;
    take?: number;
    cursor?: Record<string,unknown>;
    distinct?: string[];
  };
  create: { data: T };
  createMany: { data: T[] | Record<string,unknown>; skipDuplicates?: boolean };
  update: { where: Record<string,unknown>; data: T };
  updateMany: { where?: Record<string,unknown>; data: Partial<T> };
  delete: { where: Record<string,unknown> };
  deleteMany: { where?: Record<string,unknown> };
  upsert: { where: Record<string,unknown>; create: T; update: T };
  aggregate: Record<string,unknown>;
  groupBy: Record<string,unknown>;
  count: Record<string,unknown>;
  findRaw: Record<string,unknown>;
  aggregateRaw: Record<string,unknown>;
};




