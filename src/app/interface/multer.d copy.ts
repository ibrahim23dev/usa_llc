/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-undef */
// Type definitions for multer 1.4
// Project: https://github.com/expressjs/multer
// Definitions by: jt000 <https://github.com/jt000>
//                 vilicvane <https://github.com/vilic>
//                 David Broder-Rodgers <https://github.com/DavidBR-SW>
//                 Michael Ledin <https://github.com/mxl>
//                 HyunSeob Lee <https://github.com/hyunseob>
//                 Pierre Tchuente <https://github.com/PierreTchuente>
//                 Oliver Emery <https://github.com/thrymgjol>
//                 Piotr Błażejewicz <https://github.com/peterblazejewicz>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
import { Request, RequestHandler } from "express";
import { Readable } from "stream";

declare global {
  namespace Express {
    namespace Multer {
      /** Object containing file metadata and access information. */
      interface File {
        /** Name of the form field associated with this file. */
        fieldname: string;
        /** Name of the file on the uploader's computer. */
        originalname: string;
        /** Value of the `Content-Transfer-Encoding` header for this file. */
        encoding: string;
        /** Value of the `Content-Type` header for this file. */
        mimetype: string;
        /** Size of the file in bytes. */
        size: number;
        /** A readable stream of this file. Only available to the `_handleFile` callback for custom `StorageEngine`s. */
        stream: Readable;
        /** `DiskStorage` only: Directory to which this file has been uploaded. */
        destination: string;
        /** `DiskStorage` only: Name of this file within `destination`. */
        filename: string;
        /** `DiskStorage` only: Full path to the uploaded file. */
        path: string;
        /** `MemoryStorage` only: A Buffer containing the entire file. */
        buffer: Buffer;
      }
    }

    interface Request {
      /** `Multer.File` object populated by `single()` middleware. */
      file?: Multer.File | undefined;
      /**
       * Array or dictionary of `Multer.File` object populated by `array()`,
       * `fields()`, and `any()` middleware.
       */
      files?:
        | {
            [fieldname: string]: Multer.File[];
          }
        | Multer.File[]
        | undefined;
    }
  }
}

/**
 * Returns a Multer instance that provides several methods for generating
 * middleware that process files uploaded in `multipart/form-data` format.
 */
declare function multer(options?: multer.Options): multer.Multer;

declare namespace multer {
  interface Multer {
    single(fieldName: string): RequestHandler;
    array(fieldName: string, maxCount?: number): RequestHandler;
    fields(fields: ReadonlyArray<Field>): RequestHandler;
    any(): RequestHandler;
    none(): RequestHandler;
  }

  function diskStorage(options: DiskStorageOptions): StorageEngine;
  function memoryStorage(): StorageEngine;

  type ErrorCode =
    | "LIMIT_PART_COUNT"
    | "LIMIT_FILE_SIZE"
    | "LIMIT_FILE_COUNT"
    | "LIMIT_FIELD_KEY"
    | "LIMIT_FIELD_VALUE"
    | "LIMIT_FIELD_COUNT"
    | "LIMIT_UNEXPECTED_FILE";

  class MulterError extends Error {
    constructor(code: ErrorCode, field?: string);
    name: string;
    code: ErrorCode;
    message: string;
    field?: string | undefined;
  }

  interface FileFilterCallback {
    (error: Error): void;
    (error: null, acceptFile: boolean): void;
  }

  interface Options {
    storage?: StorageEngine | undefined;
    dest?: string | undefined;
    limits?:
      | {
          fieldNameSize?: number | undefined;
          fieldSize?: number | undefined;
          fields?: number | undefined;
          fileSize?: number | undefined;
          files?: number | undefined;
          parts?: number | undefined;
          headerPairs?: number | undefined;
        }
      | undefined;
    preservePath?: boolean | undefined;
    fileFilter?(
      req: Request,
      file: Express.Multer.File,
      callback: FileFilterCallback,
    ): void;
  }

  interface StorageEngine {
    _handleFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
    ): void;
    _removeFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null) => void,
    ): void;
  }

  interface DiskStorageOptions {
    destination?:
      | string
      | ((
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, destination: string) => void,
        ) => void)
      | undefined;
    filename?(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ): void;
  }

  interface Field {
    name: string;
    maxCount?: number | undefined;
  }
}

export = multer;
