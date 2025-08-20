/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from "express";
import ApiError from "../app/errors/ApiErrors";
import { IMulterUploadFile } from "../app/interface/fileUpload";
import { unlinkFile } from "../utils/unlinkFile";

export const requestToDeleteFile = (req: Request) => {
  try {
    const file = req.file as IMulterUploadFile;
    if (file?.filename) {
      //single file
      unlinkFile(file.path);
    } else if (req.files) {
      // multiple files array of objects [{path:""}]
      if (req.files instanceof Array && req.files?.length) {
        req.files.forEach(file => {
          unlinkFile(file.path);
        });
      } else {
        // multiple files multer fields objects in array
        Object.entries(req.files as Record<string, any>).forEach(
          ([key, _value]: [string, IMulterUploadFile[]]) => {
            if (key && _value instanceof Array) {
              _value.forEach(value => {
                unlinkFile(value.path);
              });
            }
          },
        );
      }
    }
  } catch (error: any) {
    throw new ApiError(400, error?.message || "Something went wrong");
  }
};
