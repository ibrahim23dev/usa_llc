/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import { errorLogger } from "../app/adapters/logger";

export const unlinkFile = (path: string) => {
  if (path) {
    fs.stat(path, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          errorLogger.error("File not found");
        } else {
          errorLogger.error(`Error checking file existence: ${err.message}`);
        }
      } else {
        fs.unlink(path, (error: any) => {
          if (error) {
            errorLogger.error(`Error deleting file: ${error.message}`);
          }
          // else {
          //   errorLogger.info('File deleted successfully');
          // }
        });
      }
    });
  }
};

/* 

import fs, { constants } from 'fs/promises';
import { logger } from '../app/share/logger';
// Assuming you're using Winston for logging

// Custom error types
type FileError = {
  code: string;
  message: string;
};

type UnlinkError = {
  message: string;
};

export const unlinkFile = async (path: string) => {
  try {
    // if (!path) {
    //   throw new Error('Path is required!');
    // }

    try {
      await fs.access(path, constants.F_OK); // Check if file exists
    } catch (err: any) {
      const fileError: FileError = {
        code: err.code,
        message: err.message,
      };
      if (fileError.code === 'ENOENT') {
        errorLogger.error('File not found -unlink');
      } else {
        errorLogger.error(`Error checking file existence: ${fileError.message}`);
      }
      return;
    }

    try {
      await fs.unlink(path); // Delete file
      // errorLogger.info('File deleted successfully');
    } catch (error: any) {
      const unlinkError: UnlinkError = {
        message: error.message,
      };
      errorLogger.error(`Error deleting file: ${unlinkError.message}`);
    }
  } catch (error: any) {
    errorLogger.error(`Error in unlinkFile function: ${error.message}`);
  }
};
 */
