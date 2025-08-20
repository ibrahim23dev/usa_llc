/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require("fs").promises;
const path = require("path");

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const files = [
  {
    name: "constant.ts",
    getCode: folderName =>
      `
export const ${capitalize(folderName)}_SEARCHABLE_FIELDS = ["name"];
export const ${capitalize(folderName)}_FILTERABLE_FIELDS = [
  "searchTerm",
  "fields",
  // "include", // temporally removed security reason
  "createdAtFrom",
  "createdAtTo",
  "is_deleted",
  "is_active",
  "status",
  //
  "author_id",
  "serial_number",
  //
];



      
`,
  },
  {
    name: "controller.ts",
    getCode: folderName =>
      `
  /* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from "express";
import httpStatus from "http-status";

import { AbstractController } from "../../share/Abstractor/AbstractController";
import { IUserRefAndDetails } from "../allUser/typesAndConst";
import { ${capitalize(folderName)}_FILTERABLE_FIELDS } from "./constant.${capitalize(folderName)}";
import { I${capitalize(folderName)} } from "./interface.${capitalize(folderName)}";
import { ${capitalize(folderName)}ServiceClass } from "./service.${capitalize(folderName)}";

export class ${capitalize(folderName)}ControllerClass extends AbstractController {
  public service = new ${capitalize(folderName)}ServiceClass();
  constructor() {
    super();
  }

  create${capitalize(folderName)} = this.catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUserRefAndDetails;
    const payload = { ...req.body };
    const result = await this.service.create${capitalize(folderName)}ByDb(payload, user);
    return this.sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successful create ${capitalize(folderName)}",
      data: result,
    });
  });

  getAll${capitalize(folderName)} = this.catchAsync(async (req: Request, res: Response) => {
    const filters = this.pick(req.query, ${capitalize(folderName)}_FILTERABLE_FIELDS);
    const paginationOptions = this.pick(req.query, this.PAGINATION_FIELDS);
    const user = req.user as IUserRefAndDetails;
    const result = await this.service.getAll${capitalize(folderName)}FromDb(
      filters,
      paginationOptions,
      user,
    );

    return this.sendResponse<I${capitalize(folderName)}[]>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successfully Get all ${capitalize(folderName)}",
      meta: result.meta,
      data: result.data,
    });
  });

  getSingle${capitalize(folderName)} = this.catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = req.user as IUserRefAndDetails;
      const filters = this.pick(req.query, ${capitalize(folderName)}_FILTERABLE_FIELDS);

      const result = await this.service.getSingle${capitalize(folderName)}FromDb(
        id,
        filters,
        user,
      );

      return this.sendResponse<I${capitalize(folderName)}>(req, res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "successfully get ${capitalize(folderName)}",
        data: result,
      });
    },
  );
  update${capitalize(folderName)} = this.catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    const user = req.user as IUserRefAndDetails;
    const result = await this.service.update${capitalize(folderName)}FromDb(
      id,
      updateData,
      user,
    );

    return this.sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successfully update ${capitalize(folderName)}",
      data: result,
    });
  });

  delete${capitalize(folderName)} = this.catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as IUserRefAndDetails;
    const result = await this.service.delete${capitalize(folderName)}ByIdFromDb(
      id,
      req.query,
      user,
    );
    return this.sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successfully delete ${capitalize(folderName)}",
      data: result,
    });
  });
}



`,
  },
  {
    name: "interface.ts",
    getCode: folderName =>
      `

import { ${capitalize(folderName)} } from "../../../../prisma/generate";
export type I${capitalize(folderName)}Filters = {
  searchTerm?: string;
  fields?: string;
  include?: string;
  is_active?: string | boolean;
  is_deleted?: string | boolean;
  createdAtFrom?: string;
  createdAtTo?: string;
  //
  author_id?: string;
  serial_number?: string;

};

export type I${capitalize(folderName)} = ${capitalize(folderName)};

      
`,
  },
  {
    name: "model.ts",
    getCode: folderName =>
      `
      //
     
      
`,
  },
  {
    name: "middlewares.ts",
    getCode: folderName =>
      `


    import { createPrismaMiddleware } from "../../middlewares/prismaMiddleware";
import { ENUM_REDIS_KEY } from "../../redis/consent.redis";
import { RedisCacheResetUtilsOop } from "../../redis/utls.redis";
import { PrismaActionArgsMap } from "../../share/Prisma/inteface.prisma";
import { MiddlewareParams } from "../../share/Prisma/middleware-compat";
import { I${capitalize(folderName)} } from "./interface.${capitalize(folderName)}";
type ${capitalize(folderName)}Args = PrismaActionArgsMap<I${capitalize(folderName)}>;
export const ${capitalize(folderName)}PrismaMiddleware = createPrismaMiddleware({
  before: async (params: MiddlewareParams) => {
    if (params.model === "${capitalize(folderName)}") {
      if (params.action === "create") {
        // console.log("before create Module with data:", params.args.data);
      } else if (params.action === "update") {
        // console.log("⚙️ before Updating Module with data:", params.args.data);
      }
    }
  },
  after: async (params: MiddlewareParams, result: unknown) => {
    if (params.model === "${capitalize(folderName)}") {
      const rootKey = "{ENUM_REDIS_KEY.RIS_UserAllPermission}";
      switch (params.action) {
        case "create": {
          const { data } = params.args as ${capitalize(folderName)}Args["create"];
          const key = "{rootKey}{data.user_id}";
          await new RedisCacheResetUtilsOop().resetCacheByKey(key);
          break;
        }

        case "createMany": {
          const { data } = params.args as ${capitalize(folderName)}Args["createMany"];
          let key: string | undefined;
          if (Array.isArray(data) && data.length > 0) {
            key = "{rootKey}{data[0].user_id}";
          }
          if (key) {
            await new RedisCacheResetUtilsOop().resetCacheByKey(key);
          }
          break;
        }

        case "update": {
          const { data } = params.args as ${capitalize(folderName)}Args["update"];
          const { user_id } = result as I${capitalize(folderName)};
          const key = "{rootKey}{data.user_id || user_id}";
          await new RedisCacheResetUtilsOop().resetCacheByKey(key);

          break;
        }

        case "updateMany": {
          const { where } = params.args as ${capitalize(folderName)}Args["updateMany"];
          if (where?.user_id) {
            const { user_id } = where as { user_id: string };
            const key = "{rootKey}{user_id}";
            await new RedisCacheResetUtilsOop().resetCacheByKey(key);
          }
          break;
        }

        case "delete": {
          const { where } = params.args as ${capitalize(folderName)}Args["delete"];
          const { id, user_id } = result as I${capitalize(folderName)};
          const key = "{rootKey}{user_id || where?.user_id}";
          await new RedisCacheResetUtilsOop().resetCacheByKey(key);
          break;
        }

        case "deleteMany": {
          const { where } = params.args as PrismaActionArgsMap["deleteMany"];
          if (where?.user_id) {
            const { user_id } = where as { user_id: string };
            const key = "{rootKey}{user_id}";
            await new RedisCacheResetUtilsOop().resetCacheByKey(key);
          }

          break;
        }
      }
    }

    return result;
  },
});





`,
  },

  {
    name: "route.ts",
    getCode: folderName =>
      `
import express from "express";
import { ENUM_USER_TYPE } from "../../../global/enums/users";
import { AbstractRoute } from "../../share/Abstractor/AbstractRoute";
import { ${capitalize(folderName)}ControllerClass } from "./controller.${capitalize(folderName)}";
import { ${capitalize(folderName)}ValidationClass } from "./validation.${capitalize(folderName)}";

export class ${capitalize(folderName)}RouteClass extends AbstractRoute {
  private controller = new ${capitalize(folderName)}ControllerClass();
  private validator = new ${capitalize(folderName)}ValidationClass();
  constructor() {
    super();
    // if you make a new initial route entry methord then call / optional
    this.router
      .route("/")
      // This route is open
      .get(
        this.authMiddleware(
          this.ENUM_USER_TYPE.admin,
          this.ENUM_USER_TYPE.superAdmin,
          
          this.ENUM_USER_TYPE.b2b
        ),
        this.controller.getAll${capitalize(folderName)},
      )
      .post(
        this.authMiddleware(
          this.ENUM_USER_TYPE.admin,
          this.ENUM_USER_TYPE.superAdmin,
            
          this.ENUM_USER_TYPE.b2b
        ),
     
        this.validateRequestZod(this.validator.create${capitalize(folderName)}ZodSchema),
        this.controller.create${capitalize(folderName)},
      );

    this.router
      .route("/:id")
      // This route is open
      .get(
        this.authMiddleware(
          this.ENUM_USER_TYPE.admin,
          this.ENUM_USER_TYPE.superAdmin,
           
          this.ENUM_USER_TYPE.b2b
        ),
        this.controller.getSingle${capitalize(folderName)},
      )
      .patch(
        this.authMiddleware(
          this.ENUM_USER_TYPE.admin,
          this.ENUM_USER_TYPE.superAdmin,
            
          this.ENUM_USER_TYPE.b2b
        ),
     
        this.validateRequestZod(this.validator.update${capitalize(folderName)}ZodSchema),
        this.controller.update${capitalize(folderName)},
      )
      .delete(
        this.authMiddleware(
          this.ENUM_USER_TYPE.admin,
          this.ENUM_USER_TYPE.superAdmin
          
        ),

        this.controller.delete${capitalize(folderName)},
      );
  }
}



`,
  },
  {
    name: "service.ts",
    getCode: folderName =>
      `
    /* eslint-disable @typescript-eslint/no-unused-vars */
import { IGenericResponse } from "../../interface/common";
import { IPaginationOption } from "../../interface/pagination";

import httpStatus from "http-status";
import z from "zod";
import { createSearchBuilder } from "../../../helper/searchBuilerDb";
import ApiError from "../../errors/ApiError";
import { AbstractService } from "../../share/Abstractor/AbstractService";
import { Prisma } from "../../share/Prisma/inteface.prisma";
import { IUserRefAndDetails } from "../allUser/typesAndConst";
import { ${capitalize(folderName)}_SEARCHABLE_FIELDS } from "./constant.${capitalize(folderName)}";
import { I${capitalize(folderName)}, I${capitalize(folderName)}Filters } from "./interface.${capitalize(folderName)}";
import {
  create${capitalize(folderName)}_BodyData,
  update${capitalize(folderName)}_BodyData,
} from "./validation.${capitalize(folderName)}";

// ------------------------

export type I${capitalize(folderName)}CreatePayload = z.infer<
  typeof create${capitalize(folderName)}_BodyData
>;
type I${capitalize(folderName)}UpdatePayload = z.infer<typeof update${capitalize(folderName)}_BodyData>;
export class ${capitalize(folderName)}ServiceClass extends AbstractService {
  constructor() {
    super();
    // constructor
  }
  create${capitalize(folderName)}ByDb = async (
    payload: I${capitalize(folderName)}CreatePayload & {
      author_id: string;
    },
    user: IUserRefAndDetails,
  ): Promise<I${capitalize(folderName)} | null> => {
    // const user = req.user as IUserRefAndDetails;
    //
    const { ...restPayload } = payload;

    const result = await this.prismaClient.${capitalize(folderName)}.create({
      data: {
        ...restPayload,
      },
    });

    return result;
  };
  createMany${capitalize(folderName)}ByDb = async (
    payload: Array<
      I${capitalize(folderName)}CreatePayload & {
        author_id: string;
      }
    >,
    user: IUserRefAndDetails,
  ): Promise<I${capitalize(folderName)}[] | null> => {
    // const user = req.user as IUserRefAndDetails;
    //
    const { ...restPayload } = payload;

    const result = await this.prismaClient.${capitalize(folderName)}.createManyAndReturn({
      data: {
        ...restPayload,
      },
    });

    return result;
  };

  //getAll${capitalize(folderName)}FromDb
  getAll${capitalize(folderName)}FromDb = async (
    filters: I${capitalize(folderName)}Filters,
    paginationOptions: IPaginationOption,
    user: IUserRefAndDetails,
  ): Promise<IGenericResponse<I${capitalize(folderName)}[]>> => {
    const {
      searchTerm,
      fields,
      include,
      createdAtFrom,
      createdAtTo,
      ...filtersData
    } = filters;

    filtersData.is_deleted = filtersData.is_deleted
      ? filtersData.is_deleted == "true"
        ? true
        : false
      : false;

    // Check if user is admin
    // if (user.user_type !== ENUM_USER_TYPE.admin) {
    //   filtersData.author_id = user.userId;
    // }

    // Create Prisma where clause
    const whereConditions: Prisma.${capitalize(folderName)}WhereInput = {
      AND: [],
    };

    if (!Array.isArray(whereConditions.AND)) {
      whereConditions.AND = [];
    }

    // 1. SearchTerm with OR on searchable fields
    // if (searchTerm) {
    //   whereConditions.AND.push({
    //     OR: ${capitalize(folderName)}_SEARCHABLE_FIELDS.map(field => ({
    //       [field]: {
    //         contains: searchTerm,
    //         mode: "insensitive",
    //       },
    //     })),
    //   });
    // }
    if (searchTerm) {
      const { buildSearchWhere } = createSearchBuilder({
        relationKinds: {
          // admin: "one",
          // moderator: "one",
          // writer: "one",
          // posts: "many", ...
        },
        // caseInsensitive: true,
        // defaultRelationKind: "one",
      });
      if (searchTerm) {
        const searchWhere = buildSearchWhere(
          ${capitalize(folderName)}_SEARCHABLE_FIELDS,
          searchTerm,
        );
        if (searchWhere) whereConditions.AND.push(searchWhere);
      }
    }

    // 2. Add direct filters
    const filterEntries = Object.entries(filtersData);

    if (filterEntries.length) {
      const directFilters = filterEntries.map(
        //@ts-ignore
        ([field, value]: [keyof typeof filtersData, string]) => {
          let modifyFiled;
          // if (field === "is_active") {
          //   modifyFiled = {
          //     [field]: value === "true",
          //   };
          // } else {
          // eslint-disable-next-line prefer-const
          modifyFiled = { [field]: value };
          // }

          return modifyFiled;
        },
      );

      whereConditions.AND.push(...directFilters);
    }

    // 3. Date range filters
    if (createdAtFrom && !createdAtTo) {
      const from = new Date(createdAtFrom);
      const to = new Date(new Date(createdAtFrom).setHours(23, 59, 59, 999));
      whereConditions.AND.push({
        createdAt: {
          gte: from,
          lte: to,
        },
      });
    } else if (createdAtFrom && createdAtTo) {
      whereConditions.AND.push({
        createdAt: {
          gte: new Date(createdAtFrom),
          lte: new Date(createdAtTo),
        },
      });
    }
    const { page, limit, skip, sortBy, sortOrder } =
      this.calculatePagination(paginationOptions);

    const findOption: Prisma.${capitalize(folderName)}FindManyArgs = {
      where: whereConditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: skip,
      take: limit,
      // include: {
      //   admin: true,
      // },
      // select: select,
    };
    // const allowedRelations: Prisma.${capitalize(folderName)}Include = {
    //   author: true,
    //   all${capitalize(folderName)}Permission: true,
    // };
    if (include) {
      const parser = this.includeRelationParser(include);
      const includeObject = parser.parse();
      findOption.include = includeObject;
    } else if (!include && fields) {
      const parser = this.fieldSelectorParser(
        fields,
        //allowedRelations as AllowedRelations,
      );
      findOption.select = parser.parse();
    }

    const [result, total] = await Promise.all([
      this.prismaClient.${capitalize(folderName)}.findMany(findOption),
      this.prismaClient.${capitalize(folderName)}.count({
        where: whereConditions,
      }),
    ]);

    let parsedResult = result;
    if (include && fields && result.length) {
      const parser = this.fieldSelectorParser(fields);
      parsedResult = parser.parseManual(result);
    }
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: parsedResult,
    };
  };

  // get single ${capitalize(folderName)}e form db
  getSingle${capitalize(folderName)}FromDb = async (
    id: string,
    filters: I${capitalize(folderName)}Filters,
    user: IUserRefAndDetails,
  ): Promise<I${capitalize(folderName)} | null> => {
    const { searchTerm, fields, include, ...filtersData } = filters;
    const whereConditions: Prisma.${capitalize(folderName)}WhereInput = {
      id: id,
      is_deleted: false,
    };
    const findOption: Prisma.${capitalize(folderName)}FindFirstArgs = {
      where: whereConditions,
    };
    // const allowedRelations: Prisma.${capitalize(folderName)}Include = {
    //   author: true,
    // };
    if (include) {
      const parser = this.includeRelationParser(include);
      const includeObject = parser.parse();
      findOption.include = includeObject;
    } else if (!include && fields) {
      const parser = this.fieldSelectorParser(
        fields,
        //allowedRelations as AllowedRelations,
      );
      findOption.select = parser.parse();
    }
    const result = await this.prismaClient.${capitalize(folderName)}.findFirst(findOption);
    if (!result) {
      return null;
    }

    return result;
  };

  // update ${capitalize(folderName)}e form db
  update${capitalize(folderName)}FromDb = async (
    id: string,
    payload: Partial<I${capitalize(folderName)}UpdatePayload>,
    user: IUserRefAndDetails,
  ): Promise<I${capitalize(folderName)} | null> => {
    const isExist = await this.prismaClient.${capitalize(folderName)}.findFirst({
      where: { id: id, is_deleted: false },
    });
    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "${capitalize(folderName)} not found");
    }
    // if (
    //   isExist.author_id !== user.userId &&
    //   user.user_type !== ENUM_USER_TYPE.admin
    // ) {
    //   throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to delete");
    // }

    // Now assign_by can still be cast
    const result = await this.prismaClient.${capitalize(folderName)}.update({
      where: { id: id },
      data: {
        ...payload,
      },
    });

    return result;
  };

  // delete ${capitalize(folderName)}e form db
  delete${capitalize(folderName)}ByIdFromDb = async (
    id: string,
    query: I${capitalize(folderName)}Filters,
    user: IUserRefAndDetails,
  ): Promise<I${capitalize(folderName)} | null> => {
    const isExist = await this.prismaClient.${capitalize(folderName)}.findFirst({
      where: { id: id, is_deleted: false },
    });
    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "${capitalize(folderName)} not found");
    }
    // if (
    //   isExist.author_id !== user.userId &&
    //   user.user_type !== ENUM_USER_TYPE.admin
    // ) {
    //   throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to delete");
    // }

    const result = await this.prismaClient.${capitalize(folderName)}.update({
      where: { id: id },
      data: {
        is_deleted: true,
        deletedAt: new Date(),
      },
    });
    return result;
  };
  //
}




`,
  },

  {
    name: "utls.ts",
    getCode: folderName =>
      `
import { Prisma, PrismaClient } from "../../share/Prisma/inteface.prisma";
import { createPrismaMiddleware } from "../../middlewares/prismaMiddleware";

import {
  RedisAllQueryServiceOop,
  RedisAllSetterServiceOop,
} from "../../redis/service.redis";
import { ENUM_REDIS_KEY } from "../../redis/consent.redis";
import { PrismaClientSingleton } from "../../share/Prisma/prisma";
import { I${capitalize(folderName)} } from "./interface.${capitalize(folderName)}";

export class ${capitalize(folderName)}Oop {
  readonly prismaClient: PrismaClient;
  private id: string;
  cacheData: I${capitalize(folderName)} | null = null;
  constructor(id: string) {
    this.id = id.toString();
    this.prismaClient = PrismaClientSingleton.getInstance();
  }
  async getAndSetCase(
    patten?: string,
    option?: { query: { is_deleted: boolean } },
  ) {
    const getCase = new RedisAllQueryServiceOop();
    const key = patten || "{ENUM_REDIS_KEY.RIS_${folderName}}{this.id}";
    const getCacheData = await getCase.getAnyDataByKey(key);
    if (getCacheData) {
      return getCacheData;
    }
    const whereInput: Prisma.${capitalize(folderName)}WhereInput = {
      id: this.id,
    };
    if (option?.query?.is_deleted) {
      whereInput.is_deleted = option?.query?.is_deleted;
    }
  //! -- please Middleware add prisma allMiddleware
    const cacheData = await this.prismaClient.${capitalize(folderName)}.findFirst({
      where: whereInput,
    });
    if (!cacheData) {
      return null;
    }
    this.cacheData = cacheData;
    const setter = new RedisAllSetterServiceOop();
    await setter.redisSetter([{ key: key, value: cacheData }]);
    return cacheData;
  }
}


`,
  },
  {
    name: "validation.ts",
    getCode: folderName =>
      `
import { z } from "zod";
import { PrismaEnum } from "../../share/Prisma/inteface.prisma";

export const create${capitalize(folderName)}_BodyData = z
  .object({
  
    name: z.string(),
 
  })
  .strict();

export const update${capitalize(folderName)}_BodyData = create${capitalize(folderName)}_BodyData.merge(
  z.object({
    // is_deleted: z.boolean().optional(),

    status: z.nativeEnum(PrismaEnum.AllTableStatus).optional(),

    //
  }),
);

export class ${capitalize(folderName)}ValidationClass {
  public readonly create${capitalize(folderName)}ZodSchema = z.object({
    body: create${capitalize(folderName)}_BodyData,
  });

  public readonly update${capitalize(folderName)}ZodSchema = z.object({
    body: update${capitalize(folderName)}_BodyData.deepPartial(),
  });
  constructor() {
    // constructor
  }
}


`,
  },
];

async function createFolderAndFiles(parentDirectory, folderName) {
  try {
    const moduleDirectory = path.join(parentDirectory, folderName);
    // Create the folder
    await fs.mkdir(moduleDirectory);
    // Create the files using for...of loop and async/await
    for (const file of files) {
      const parts = file.name.split(".");
      //after pop() then return pop file
      const fileExtinctionsName = `${parts.pop()}`; //ts
      const fileName = parts.join("."); //interface.favoriteProduct
      const filePath = path.join(
        moduleDirectory,
        `${fileName}.${capitalize(folderName)}.${fileExtinctionsName}`,
      );
      await fs.writeFile(filePath, file.getCode(folderName));
      console.log(`Created ${filePath}`);
    }

    console.log("Module and files created successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getUserInput() {
  return new Promise(resolve => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(
      'Enter the Module name (or "exit" to terminate): ',
      folderName => {
        readline.close();
        resolve(folderName);
      },
    );
  });
}

async function start() {
  const parentDirectory = "src/app/modules";
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const folderName = await getUserInput();
    if (folderName.toLowerCase() === "exit") {
      process.exit(0);
    }
    await createFolderAndFiles(parentDirectory, folderName);
  }
}

start();
