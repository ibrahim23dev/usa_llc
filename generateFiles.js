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
export const ${capitalize(folderName)}_SEARCHABLE_FIELDS = ['productTitle'];
export const ${capitalize(folderName)}_FILTERABLE_FIELDS = [
  'searchTerm',
  'productId',

  'status',
  'delete',
  'serialNumber',
  'is_deleted',
  'cache',
  //
  'needProperty',
  'createdAtFrom',
  'createdAtTo',
  //
  'author.userId',
  'author.roleBaseUserId',
];

      
`,
  },
  {
    name: "controller.ts",
    getCode: folderName =>
      `
      /* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../global/constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { IUserRef } from '../allUser/typesAndConst';
import { RequestToRefUserObject } from '../allUser/user/user.utils';
import { ${capitalize(folderName)}_FILTERABLE_FIELDS } from './constant.${capitalize(folderName)}';
import { I${capitalize(folderName)} } from './interface.${capitalize(folderName)}';
import { ${capitalize(folderName)}Service } from './service.${capitalize(folderName)}';

// import { z } from 'zod'
const create${capitalize(folderName)} = catchAsync(
  async (req: Request, res: Response) => {
    req.body = {
      ...req.body,
      author: RequestToRefUserObject(req.user as IUserRef),
    };
    const result = await ${capitalize(folderName)}Service.create${capitalize(folderName)}ByDb(
      req.body,
      req,
    );
    sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successful create ${capitalize(folderName)}',
      data: result,
    });
  },
);

const getAll${capitalize(folderName)} = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, ${capitalize(folderName)}_FILTERABLE_FIELDS);
    const paginationOptions = pick(req.query, PAGINATION_FIELDS);

    const result = await ${capitalize(folderName)}Service.getAll${capitalize(folderName)}FromDb(
      filters,
      paginationOptions,
      req,
    );

    sendResponse<I${capitalize(folderName)}[]>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfully Get all ${capitalize(folderName)}',
      meta: result.meta,
      data: result.data,
    });
    // next();
  },
);

const getSingle${capitalize(folderName)} = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

    const filters = pick(req.query, ${capitalize(folderName)}_FILTERABLE_FIELDS);

    const result = await ${capitalize(folderName)}Service.getSingle${capitalize(folderName)}FromDb(
      id,
      filters,
      req,
    );

    sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfully get ${capitalize(folderName)}',
      data: result,
    });
  },
);
const update${capitalize(folderName)} = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await ${capitalize(folderName)}Service.update${capitalize(folderName)}FromDb(
      id,
      updateData,
      req,
    );

    sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfully update ${capitalize(folderName)}',
      data: result,
    });
  },
);
const update${capitalize(folderName)}SerialNumber = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await ${capitalize(folderName)}Service.update${capitalize(folderName)}SerialNumberFromDb(
        req.body,
      );

    sendResponse<I${capitalize(folderName)}[]>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfully update ${capitalize(folderName)}',
      data: result,
    });
  },
);

const delete${capitalize(folderName)} = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ${capitalize(folderName)}Service.delete${capitalize(folderName)}ByIdFromDb(
      id,
      req.query,
      req,
    );
    sendResponse<I${capitalize(folderName)}>(req, res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfully delete ${capitalize(folderName)}',
      data: result,
    });
  },
);
export const ${capitalize(folderName)}Controller = {
  create${capitalize(folderName)},
  getAll${capitalize(folderName)},
  getSingle${capitalize(folderName)},
  update${capitalize(folderName)},
  delete${capitalize(folderName)},
  //
  update${capitalize(folderName)}SerialNumber,
};

`,
  },
  {
    name: "interface.ts",
    getCode: folderName =>
      `
      import { Model } from 'mongoose';
import { z } from 'zod';
import { I_STATUS, I_YN } from '../../../global/enum_constant_type';
import { IUserRef } from '../allUser/typesAndConst';
import { ${capitalize(folderName)}Validation } from './validation.${capitalize(folderName)}';

export type I${capitalize(folderName)}Filters = {
  searchTerm?: string;
  status?: I_STATUS;
  serialNumber?: number;
  delete?: string;
  children?: string;
  cache?: string;
  is_deleted?: string | boolean;
  productId?: string;
  'author.userId'?: string;
  'author.roleBaseUserId'?: string;
  //
  createdAtFrom?: string;
  createdAtTo?: string;
  needProperty?: string;
  //
};

export type I${capitalize(folderName)} = z.infer<
  typeof ${capitalize(folderName)}Validation.create${capitalize(folderName)}_BodyData
> &
  z.infer<typeof ${capitalize(folderName)}Validation.update${capitalize(folderName)}_BodyData> & {
    is_deleted: boolean;
    author: IUserRef;
  };

export type ${capitalize(folderName)}Model = Model<
  I${capitalize(folderName)},
  Record<string, unknown>
>;

      
`,
  },
  {
    name: "model.ts",
    getCode: folderName =>
      `
      import { Schema, model } from 'mongoose';

import { ENUM_STATUS, STATUS_ARRAY } from '../../../global/enum_constant_type';
import { mongooseIUserRef } from '../allUser/typesAndConst';
import {
  ${capitalize(folderName)}Model,
  I${capitalize(folderName)},
} from './interface.${capitalize(folderName)}';

const ${capitalize(folderName)}Schema = new Schema<
  I${capitalize(folderName)},
  ${capitalize(folderName)}Model
>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productTitle: String,
    author: mongooseIUserRef,
    serialNumber: {
      type: Number,
    },
    status: {
      type: String,
      enum: STATUS_ARRAY,
      default: ENUM_STATUS.ACTIVE,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  },
);
// after findOneAndDelete then data then call this hook
${capitalize(folderName)}Schema.post('findOneAndDelete', async function () {
  try {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const dataId = this.getFilter();
    // // console.log(dataId); // { _id: '6607a2b70d0b8a202a1b81b4' }
    // const res = await ${capitalize(folderName)}.findOne({ _id: dataId?._id }).lean();
    // if (res) {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   //@ts-ignore
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   const { status, is_deleted, createdAt, updatedAt, ...otherData } = res;
    //   await Trash${capitalize(folderName)}.create({
    //     ...otherData,
    //   });
    // } else {
    //   throw new ApiError(400, 'Not found this item');
    // }
    // const res = await redisClient.del(ENUM_REDIS_KEY.RIS_All_Categories);
  } catch (error: any) {
    // console.log('🚀 ~ error:', error);
  }
});
// after findOneAndUpdate then data then call this hook
${capitalize(folderName)}Schema.post(
  'findOneAndUpdate',
  async function (data: any & { _id: string }, next: any) {
    try {
     
      // console.log('update');
      next();
    } catch (error: any) {
      next(error);
    }
  },
);
// before save/create then data then call this hook
${capitalize(folderName)}Schema.post(
  'save',
  async function (data: I${capitalize(folderName)}, next) {
    try {
      // const res = await redisClient.del(ENUM_REDIS_KEY.RIS_All_Categories);
     
      next();
    } catch (error: any) {
      next(error);
    }
  },
);

export const ${capitalize(folderName)} = model<I${capitalize(folderName)}, ${capitalize(folderName)}Model>(
  '${capitalize(folderName)}',
  ${capitalize(folderName)}Schema,
);
// export const Trash${capitalize(folderName)} = model<
//   I${capitalize(folderName)},
//   ${capitalize(folderName)}Model
// >('Trash${capitalize(folderName)}', ${capitalize(folderName)}Schema);
     
      
`,
  },
  {
    name: "route.ts",
    getCode: folderName =>
      `
import express from 'express';
import { ENUM_USER_TYPE } from '../../../global/enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import { uploadAwsS3Bucket } from '../aws/utls.aws';
import parseBodyData from '../../middlewares/utils/parseBodyData';
import { z } from 'zod';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ${capitalize(folderName)}Controller } from './controller.${capitalize(folderName)}';
import { ${capitalize(folderName)}Validation } from './validation.${capitalize(folderName)}';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(
    authMiddleware(
      ENUM_USER_TYPE.admin,
      ENUM_USER_TYPE.superAdmin,
      ENUM_USER_TYPE.b2b,
    ),
    ${capitalize(folderName)}Controller.getAll${capitalize(folderName)},
  )
  .post(
    authMiddleware(
      ENUM_USER_TYPE.admin,
      ENUM_USER_TYPE.superAdmin,
      ENUM_USER_TYPE.b2b,
    ),
uploadAwsS3Bucket.array('images'),
    parseBodyData({}),
    validateRequestZod(
      ${capitalize(folderName)}Validation.create${capitalize(folderName)}ZodSchema,
    ),
    ${capitalize(folderName)}Controller.create${capitalize(folderName)},
  );
router.route('/serialnumber-update').patch(
  authMiddleware(
    ENUM_USER_TYPE.admin,
    ENUM_USER_TYPE.superAdmin,
    ENUM_USER_TYPE.b2b,
  ),

  validateRequestZod(
    z.object({
      body: z.array(z.object({ _id: z.string(), number: z.number() })),
    }),
  ),
  ${capitalize(folderName)}Controller.update${capitalize(folderName)}SerialNumber,
);

router
  .route('/:id')
  // This route is open
  .get(
    authMiddleware(
      ENUM_USER_TYPE.admin,
      ENUM_USER_TYPE.superAdmin,
      ENUM_USER_TYPE.b2b,
    ),
    ${capitalize(folderName)}Controller.getSingle${capitalize(folderName)},
  )
  .patch(
    authMiddleware(
      ENUM_USER_TYPE.admin,
      ENUM_USER_TYPE.superAdmin,
      ENUM_USER_TYPE.b2b,
    ),
uploadAwsS3Bucket.array('images'),
    parseBodyData({}),
    validateRequestZod(
      ${capitalize(folderName)}Validation.update${capitalize(folderName)}ZodSchema,
    ),
    ${capitalize(folderName)}Controller.update${capitalize(folderName)},
  )
  .delete(
    authMiddleware(
      ENUM_USER_TYPE.admin,
      ENUM_USER_TYPE.superAdmin,
      ENUM_USER_TYPE.b2b,
    ),

    ${capitalize(folderName)}Controller.delete${capitalize(folderName)},
  );

export const ${capitalize(folderName)}Route = router;

`,
  },
  {
    name: "service.ts",
    getCode: folderName =>
      `
      /* eslint-disable @typescript-eslint/no-unused-vars */
import { PipelineStage, Schema, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { Request } from 'express';
import httpStatus from 'http-status';
import { ENUM_USER_TYPE } from '../../../global/enums/users';
import {
  ILookupCollection,
  LookupAnyRoleDetailsReusable,
  LookupReusable,
} from '../../../helper/lookUpResuable';
import ApiError from '../../errors/ApiError';
import { IUserRef } from '../allUser/typesAndConst';
import { ${capitalize(folderName)}_SEARCHABLE_FIELDS } from './constant.${capitalize(folderName)}';
import {
  I${capitalize(folderName)},
  I${capitalize(folderName)}Filters,
} from './interface.${capitalize(folderName)}';
import { ${capitalize(folderName)} } from './model.${capitalize(folderName)}';

const create${capitalize(folderName)}ByDb = async (
  payload: I${capitalize(folderName)},
  req: Request,
): Promise<I${capitalize(folderName)} | null> => {
  const user = req.user as IUserRef;
  const [findAlreadyExists] = await Promise.all([
    ${capitalize(folderName)}.findOne({
      'author.userId': new Types.ObjectId(user.userId),
      productId: new Types.ObjectId(payload.productId),
      is_deleted: false,
    }).sort({ serialNumber: -1 }),
  ]);

  if (findAlreadyExists) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Product is already added ');
  }
  const result = await ${capitalize(folderName)}.create(payload);
  return result;
};

//getAll${capitalize(folderName)}FromDb
const getAll${capitalize(folderName)}FromDb = async (
  filters: I${capitalize(folderName)}Filters,
  paginationOptions: IPaginationOption,
  req: Request,
): Promise<IGenericResponse<I${capitalize(folderName)}[]>> => {
  const user = req?.user as IUserRef;
  //****************search and filters start************/
  const {
    searchTerm,
    createdAtFrom,
    createdAtTo,
    needProperty,
    ...filtersData
  } = filters;
  //***********cache start************* */
  if (user.role !== ENUM_USER_TYPE.admin) {
    filtersData['author.userId'] = user.userId.toString();
  }
  filtersData.is_deleted = filtersData.is_deleted
    ? filtersData.is_deleted == 'true'
      ? true
      : false
    : false;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ${capitalize(folderName)}_SEARCHABLE_FIELDS.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const condition = Object.entries(filtersData).map(
      //@ts-ignore
      ([field, value]: [keyof typeof filtersData, string]) => {
        let modifyFiled;
        /* 
        if (field === 'userRoleBaseId' || field === 'referRoleBaseId') {
        modifyFiled = { [field]: new Types.ObjectId(value) };
        } else {
         modifyFiled = { [field]: value };
         } 
       */
        if (
          field === 'author.userId' ||
          field === 'author.roleBaseUserId' ||
          field === 'productId'
        ) {
          modifyFiled = {
            [field]: new Types.ObjectId(value),
          };
        } else {
          modifyFiled = { [field]: value };
        }
        // console.log(modifyFiled);
        return modifyFiled;
      },
    );
    //
    if (createdAtFrom && !createdAtTo) {
      const timeTo = new Date(createdAtFrom);
      const createdAtToModify = new Date(timeTo.setHours(23, 59, 59, 999));
      condition.push({
        //@ts-ignore
        createdAt: {
          //@ts-ignore
          $gte: new Date(createdAtFrom),
          $lte: new Date(createdAtToModify),
        },
      });
    } else if (createdAtFrom && createdAtTo) {
      condition.push({
        //@ts-ignore
        createdAt: {
          //@ts-ignore
          $gte: new Date(createdAtFrom),
          $lte: new Date(createdAtTo),
        },
      });
    }

    //
    andConditions.push({
      $and: condition,
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const result = await ${capitalize(folderName)}.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 10 },
  ];
  const collections: ILookupCollection<any>[] = []; // Use the correct type here
  if (needProperty?.includes('productId')) {
    const pipelineConnection: ILookupCollection<any> = {
      connectionName: 'products',
      idFiledName: 'productId',
      pipeLineMatchField: '_id',
      outPutFieldName: 'productDetails',
    };
    collections.push(pipelineConnection);
  }
  if (needProperty && needProperty.includes('author')) {
    LookupAnyRoleDetailsReusable(pipeline, {
      collections: [
        {
          roleMatchFiledName: 'author.role',
          idFiledName: '$author.roleBaseUserId',
          pipeLineMatchField: '$_id',
          outPutFieldName: 'details',
          margeInField: 'author',
        },
      ],
    });
  }
  if (collections.length) {
    // Use the collections in LookupReusable
    LookupReusable<any, any>(pipeline, {
      collections: collections,
    });
  }

  // const result = await ${capitalize(folderName)}.aggregate(pipeline);
  // const total = await ${capitalize(folderName)}.countDocuments(whereConditions);
  const [result, total] = await Promise.all([
    ${capitalize(folderName)}.aggregate(pipeline),
    ${capitalize(folderName)}.countDocuments(whereConditions),
  ]);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single ${capitalize(folderName)}e form db
const getSingle${capitalize(folderName)}FromDb = async (
  id: string,
  filters: I${capitalize(folderName)}Filters,
  req: Request,
): Promise<I${capitalize(folderName)} | null> => {
  const user = req.user as IUserRef;
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id), is_deleted: false } },
    ///***************** */ images field ******start
  ];
  const result = await ${capitalize(folderName)}.aggregate(pipeline);
  const dataReturn = result.length ? result[0] : null;
  if (!dataReturn) {
    throw new ApiError(httpStatus.NOT_FOUND, '${capitalize(folderName)} not found');
  }
  if (
    dataReturn.author.userId.toString() !== user.userId.toString() &&
    user.role !== ENUM_USER_TYPE.admin
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete');
  }
  return dataReturn;
};

// update ${capitalize(folderName)}e form db
const update${capitalize(folderName)}FromDb = async (
  id: string,
  payload: Partial<I${capitalize(folderName)}>,
  req: Request,
): Promise<I${capitalize(folderName)} | null> => {
  const user = req.user as IUserRef;
  const isExist = (await ${capitalize(folderName)}.findById(id)) as I${capitalize(folderName)} & {
    _id: Schema.Types.ObjectId;
  };
  if (!isExist || isExist.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, '${capitalize(folderName)} not found');
  }
  if (
    isExist.author.userId.toString() !== user.userId.toString() &&
    user.role !== ENUM_USER_TYPE.admin
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete');
  }
  const result = await ${capitalize(folderName)}.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

// delete ${capitalize(folderName)}e form db
const delete${capitalize(folderName)}ByIdFromDb = async (
  id: string,
  query: I${capitalize(folderName)}Filters,
  req: Request,
): Promise<I${capitalize(folderName)} | null> => {
  const user = req.user as IUserRef;
  const isExist = (await ${capitalize(folderName)}.findById(id)) as I${capitalize(folderName)} & {
    _id: Schema.Types.ObjectId;
  };
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, '${capitalize(folderName)} not found');
  }
  if (
    isExist.author.userId.toString() !== user.userId.toString() &&
    user.role !== ENUM_USER_TYPE.admin
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete');
  }

  const result = await ${capitalize(folderName)}.findOneAndUpdate(
    { _id: id },
    { is_deleted: true },
    { new: true, runValidators: true },
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete');
  }
  return result;
};
//
const update${capitalize(folderName)}SerialNumberFromDb = async (
  payload: { _id: string; number: number }[],
): Promise<I${capitalize(folderName)}[] | null> => {
  const premissAll: any = [];
  for (let i = 0; i < payload.length; i++) {
    premissAll.push(
      ${capitalize(folderName)}.findByIdAndUpdate(
        payload[i]._id,
        { serialNumber: payload[i].number },
        { new: true, runValidators: true },
      ),
    );
  }
  const result = await Promise.all(premissAll);
  // console.log('🚀 ~ result:', result);
  return result;
};

export const ${capitalize(folderName)}Service = {
  create${capitalize(folderName)}ByDb,
  getAll${capitalize(folderName)}FromDb,
  getSingle${capitalize(folderName)}FromDb,
  update${capitalize(folderName)}FromDb,
  delete${capitalize(folderName)}ByIdFromDb,
  //
  update${capitalize(folderName)}SerialNumberFromDb,
};

`,
  },
  {
    name: "validation.ts",
    getCode: folderName =>
      `
 import { Types } from 'mongoose';
import { z } from 'zod';
import { I_STATUS, STATUS_ARRAY } from '../../../global/enum_constant_type';

const create${capitalize(folderName)}_BodyData = z.object({
  productId: z.string().or(z.instanceof(Types.ObjectId)),
  productTitle: z.string(),
  status: z.enum(STATUS_ARRAY as [I_STATUS, ...I_STATUS[]]).optional(),
  serialNumber: z.number().optional(),
  quantity: z.number().optional(),
});
const update${capitalize(folderName)}_BodyData = z.object({
  is_deleted: z.boolean().optional(),
});
const create${capitalize(folderName)}ZodSchema = z.object({
  body: create${capitalize(folderName)}_BodyData,
});

const update${capitalize(folderName)}ZodSchema = z.object({
  body: create${capitalize(folderName)}_BodyData
    .merge(update${capitalize(folderName)}_BodyData)
    .deepPartial(),
});

export const ${capitalize(folderName)}Validation = {
  create${capitalize(folderName)}ZodSchema,
  update${capitalize(folderName)}ZodSchema,
  //
  create${capitalize(folderName)}_BodyData,
  update${capitalize(folderName)}_BodyData,
};

`,
  },
  {
    name: "utls.ts",
    getCode: folderName =>
      `
 import { Types } from 'mongoose';
import { ENUM_REDIS_KEY } from '../../redis/consent.redis';
import {
  RedisAllQueryServiceOop,
  RedisAllSetterServiceOop,
} from '../../redis/service.redis';
import { I${capitalize(folderName)} } from './interface.${capitalize(folderName)}';
import { ${capitalize(folderName)} } from './model.${capitalize(folderName)}';

export class ${capitalize(folderName)}Oop {
  private id: string;
  cacheData: I${capitalize(folderName)} | null = null;
  constructor(id: string) {
    this.id = id.toString();
  }
  async getAndSetCase(patten?: string) {
    const getCase = new RedisAllQueryServiceOop();
    const key = patten || "{ENUM_REDIS_KEY.RIS_${capitalize(folderName)}}{this.id}";
    const get${capitalize(folderName)} =await getCase.getAnyDataByKey(key);
    if (get${capitalize(folderName)}) {
      return get${capitalize(folderName)};
    }
    const cacheData = await ${capitalize(folderName)}.findOne({
      _id: new Types.ObjectId(this.id),
      is_deleted: false,
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
