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
  "bank_id",
  "bank_account_id",
  "user_id",
  "approver_id",
  "deposit_date", //dat
  "deposit_status",
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

import { AbstractController } from "../../../share/Abstractor/AbstractController";
import { IUserRef } from "../../allUser/typesAndConst";
import { ${capitalize(folderName)}_FILTERABLE_FIELDS } from "./constant.${capitalize(folderName)}";
import { I${capitalize(folderName)} } from "./interface.${capitalize(folderName)}";
import { ${capitalize(folderName)}ServiceClass } from "./service.${capitalize(folderName)}";

export class ${capitalize(folderName)}ControllerClass extends AbstractController {
  public service = new ${capitalize(folderName)}ServiceClass();
  constructor() {
    super();
  }

  create${capitalize(folderName)} = this.catchAsync(
    async (req: Request, res: Response) => {
      const user = req.user as IUserRef;
      const payload = { ...req.body, author_id: user.userId };
      const result = await this.service.create${capitalize(folderName)}ByDb(
        payload,
        req.user as IUserRef,
      );
    return  this.sendResponse<I${capitalize(folderName)}>(req, res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "successful create ${capitalize(folderName)}",
        data: result,
      });
    },
  );

  getAll${capitalize(folderName)} = this.catchAsync(
    async (req: Request, res: Response) => {
      const filters = this.pick(req.query, ${capitalize(folderName)}_FILTERABLE_FIELDS);
      const paginationOptions = this.pick(req.query, this.PAGINATION_FIELDS);

      const result = await this.service.getAll${capitalize(folderName)}FromDb(
        filters,
        paginationOptions,
        req.user as IUserRef,
      );

    return  this.sendResponse<I${capitalize(folderName)}[]>(req, res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "successfully Get all ${capitalize(folderName)}",
        meta: result.meta,
        data: result.data,
      });
    },
  );

  getSingle${capitalize(folderName)} = this.catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const filters = this.pick(req.query, ${capitalize(folderName)}_FILTERABLE_FIELDS);

      const result = await this.service.getSingle${capitalize(folderName)}FromDb(
        id,
        filters,
        req.user as IUserRef,
      );

    return  this.sendResponse<I${capitalize(folderName)}>(req, res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "successfully get ${capitalize(folderName)}",
        data: result,
      });
    },
  );
  update${capitalize(folderName)} = this.catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const updateData = { ...req.body };

      const result = await this.service.update${capitalize(folderName)}FromDb(
        id,
        updateData,
        req.user as IUserRef,
      );

    return  this.sendResponse<I${capitalize(folderName)}>(req, res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "successfully update ${capitalize(folderName)}",
        data: result,
      });
    },
  );

  delete${capitalize(folderName)} = this.catchAsync(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.delete${capitalize(folderName)}ByIdFromDb(
        id,
        req.query,
        req.user as IUserRef,
      );
    return  this.sendResponse<I${capitalize(folderName)}>(req, res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "successfully delete ${capitalize(folderName)}",
        data: result,
      });
    },
  );
}



`,
  },
  {
    name: "interface.ts",
    getCode: folderName =>
      `

import { ${capitalize(folderName)} } from "../../../share/Prisma/inteface.prisma";

export type I${capitalize(folderName)}Filters = {
  searchTerm?: string;
  fields?: string;
  include?: string;
  // is_active?: string | boolean;
  is_deleted?: string | boolean;
  createdAtFrom?: string;
  createdAtTo?: string;
  //
  bank_id?: string;
  bank_account_id?: string;
  user_id?: string;
  approver_id?: string;
  deposit_date?: string;
  deposit_status?: string;
  serialNumber?: string;
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
    name: "route.ts",
    getCode: folderName =>
      `
 import express from "express";
import { ENUM_USER_TYPE } from "../../../../global/enums/users";
import { AbstractRoute } from "../../../share/Abstractor/AbstractRoute";
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
          ENUM_USER_TYPE.admin,
          ENUM_USER_TYPE.superAdmin,
          ENUM_USER_TYPE.b2b,
        ),
        this.controller.getAll${capitalize(folderName)},
      )
      .post(
        this.authMiddleware(
          ENUM_USER_TYPE.admin,
          ENUM_USER_TYPE.superAdmin,
          ENUM_USER_TYPE.b2b,
        ),
        //@ts-ignore
        this.uploadAwsS3Bucket.array("images"),
        this.parseBodyData({}),
        this.validateRequestZod(this.validator.create${capitalize(folderName)}ZodSchema),
        this.controller.create${capitalize(folderName)},
      );

    this.router
      .route("/:id")
      // This route is open
      .get(
        this.authMiddleware(
          ENUM_USER_TYPE.admin,
          ENUM_USER_TYPE.superAdmin,
          ENUM_USER_TYPE.b2b,
        ),
        this.controller.getSingle${capitalize(folderName)},
      )
      .patch(
        this.authMiddleware(
          ENUM_USER_TYPE.admin,
          ENUM_USER_TYPE.superAdmin,
          ENUM_USER_TYPE.b2b,
        ),
        this.uploadAwsS3Bucket.single(
          "images",
        ) as unknown as express.RequestHandler,
        this.parseBodyData({}),
        this.validateRequestZod(this.validator.update${capitalize(folderName)}ZodSchema),
        this.controller.update${capitalize(folderName)},
      )
      .delete(
        this.authMiddleware(
          ENUM_USER_TYPE.admin,
          ENUM_USER_TYPE.superAdmin,
          ENUM_USER_TYPE.b2b,
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
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOption } from "../../../interface/pagination";

import httpStatus from "http-status";
import { ENUM_USER_TYPE } from "../../../../global/enums/users";
import ApiError from "../../../errors/ApiError";
import { AbstractService } from "../../../share/Abstractor/AbstractService";
import { Prisma } from "../../../share/Prisma/inteface.prisma";
import { AllowedRelations } from "../../../share/selectFields";
import { IUserRef } from "../../allUser/typesAndConst";
import { ${capitalize(folderName)}_SEARCHABLE_FIELDS } from "./constant.${capitalize(folderName)}";
import {
  I${capitalize(folderName)},
  I${capitalize(folderName)}Filters,
} from "./interface.${capitalize(folderName)}";

// ------------------------

export class ${capitalize(folderName)}ServiceClass extends AbstractService {
  constructor() {
    super();
    // constructor
  }
  create${capitalize(folderName)}ByDb = async (
    payload: Prisma.${capitalize(folderName)}CreateInput,
    user: IUserRef,
  ): Promise<I${capitalize(folderName)} | null> => {
    const result = await this.prismaClient.${capitalize(folderName)}.create({
      data: payload,
    });
    return result;
  };

  //getAll${capitalize(folderName)}FromDb
  getAll${capitalize(folderName)}FromDb = async (
    filters: I${capitalize(folderName)}Filters,
    paginationOptions: IPaginationOption,
    user: IUserRef,
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
    if (user.user_type !== ENUM_USER_TYPE.admin) {
      filtersData.user_id = user.userId;
    }

    // Create Prisma where clause
    const whereConditions: Prisma.${capitalize(folderName)}WhereInput = {
      AND: [],
    };

    if (!Array.isArray(whereConditions.AND)) {
      whereConditions.AND = [];
    }

    // 1. SearchTerm with OR on searchable fields
    if (searchTerm) {
      whereConditions.AND.push({
        OR: ${capitalize(folderName)}_SEARCHABLE_FIELDS.map(field => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      });
    }

    // 2. Add direct filters
    const filterEntries = Object.entries(filtersData);

    if (filterEntries.length) {
      const directFilters = filterEntries.map(
        //@ts-ignore
        ([field, value]: [keyof typeof filtersData, string]) => {
          let modifyFiled;
          if (field === "is_deleted") {
            modifyFiled = {
              [field]: value == "true",
            };
          } else {
            modifyFiled = { [field]: value };
          }

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
    const allowedRelations: Prisma.${capitalize(folderName)}Include = {
      approver: true,
    };
    if (include) {
      const parser = this.includeRelationParser(include);
      const includeObject = parser.parse();
      findOption.include = includeObject;
    } else if (!include && fields) {
      const parser = this.fieldSelectorParser(
        fields,
        allowedRelations as AllowedRelations,
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
    user: IUserRef,
  ): Promise<I${capitalize(folderName)} | null> => {
    const { searchTerm, fields, include, ...filtersData } = filters;
    const whereConditions: Prisma.${capitalize(folderName)}WhereInput = {
      id: id,
      is_deleted: false,
    };
    const findOption: Prisma.${capitalize(folderName)}FindFirstArgs = {
      where: whereConditions,
    };
    const allowedRelations: Prisma.${capitalize(folderName)}Include = {
      approver: true,
    };
    if (include) {
      const parser = this.includeRelationParser(include);
      const includeObject = parser.parse();
      findOption.include = includeObject;
    } else if (!include && fields) {
      const parser = this.fieldSelectorParser(
        fields,
        allowedRelations as AllowedRelations,
      );
      findOption.select = parser.parse();
    }
    const result = await this.prismaClient.${capitalize(folderName)}.findFirst(findOption);
    return result;
  };

  // update ${capitalize(folderName)}e form db
  update${capitalize(folderName)}FromDb = async (
    id: string,
    payload: Partial<I${capitalize(folderName)}>,
    user: IUserRef,
  ): Promise<I${capitalize(folderName)} | null> => {
    const isExist = await this.prismaClient.${capitalize(folderName)}.findFirst({
      where: { id: id, is_deleted: false },
    });
    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "${capitalize(folderName)} not found");
    }
    if (
      isExist.approver_id !== user.userId &&
      user.user_type !== ENUM_USER_TYPE.admin
    ) {
      throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to delete");
    }
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    );
    // Now assign_by can still be cast
    const result = await this.prismaClient.${capitalize(folderName)}.update({
      where: { id: id },
      data: cleanedPayload,
    });

    return result;
  };

  // delete ${capitalize(folderName)}e form db
  delete${capitalize(folderName)}ByIdFromDb = async (
    id: string,
    query: I${capitalize(folderName)}Filters,
    user: IUserRef,
  ): Promise<I${capitalize(folderName)} | null> => {
    const isExist = await this.prismaClient.${capitalize(folderName)}.findFirst({
      where: { id: id, is_deleted: false },
    });
    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "${capitalize(folderName)} not found");
    }
    if (
      isExist.approver_id !== user.userId &&
      user.user_type !== ENUM_USER_TYPE.admin
    ) {
      throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to delete");
    }

    const result = await this.prismaClient.${capitalize(folderName)}.update({
      where: { id: id },
      data: {
        is_deleted: true,
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
    import { createPrismaMiddleware } from "../../../middlewares/prismaMiddleware";
import { ENUM_REDIS_KEY } from "../../../redis/consent.redis";

import {
  RedisAllQueryServiceOop,
  RedisAllSetterServiceOop,
} from "../../../redis/service.redis";
import { Prisma, PrismaClient } from "../../../share/Prisma/inteface.prisma";
import { PrismaClientSingleton } from "../../../share/Prisma/prisma";
import { I${capitalize(folderName)} } from "./interface.${capitalize(folderName)}";
export const ${capitalize(folderName)}PrismaMiddleware = createPrismaMiddleware({
  /*  
 before: async (params: Prisma.MiddlewareParams) => {
    if (params.model === "User" && params.action === "create") {
      const password = params.args?.data?.password;
      if (password) {
        const hashedPassword = await bcrypt.hash(
          password,
          Number(config.bycrypt_salt_rounds),
        );
        params.args.data.password = hashedPassword;
      }
    }
  },
   */
  before: async (params: Prisma.MiddlewareParams) => {
    if (params.model === "${capitalize(folderName)}") {
      if (params.action === "create") {
        // console.log("before create Module with data:", params.args.data);
      } else if (params.action === "update") {
        // console.log("⚙️ before Updating Module with data:", params.args.data);
      }
    }
  },
  after: async (params: Prisma.MiddlewareParams, result: any) => {
    if (params.model === "${capitalize(folderName)}") {
      if (params.action === "create") {
        // console.log("after create Module with data:", params.args.data);
        // console.log("after result", result);
      } else if (params.action === "update") {
        // console.log("⚙️ after Updating Module with data:", params.args.data);
        // console.log("after update result", result);
      }
    }
    return result;
  },
});
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
    const key = patten || '{ENUM_REDIS_KEY.RIS_${capitalize(folderName)}}{this.id}';
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

export class ${capitalize(folderName)}ValidationClass {
  public readonly create${capitalize(folderName)}_BodyData = z
    .object({
      name: z.string().transform(val => val.toLowerCase()),
    })
    .strict();

  public readonly update${capitalize(folderName)}_BodyData = z.object({
    is_deleted: z.boolean().optional(),
    is_active: z.boolean().optional(),

    serialNumber: z.number().optional(),
  });
  public readonly create${capitalize(folderName)}ZodSchema = z.object({
    body: this.create${capitalize(folderName)}_BodyData,
  });

  public readonly update${capitalize(folderName)}ZodSchema = z.object({
    body: this.create${capitalize(folderName)}_BodyData
      .merge(this.update${capitalize(folderName)}_BodyData)
      .deepPartial(),
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
