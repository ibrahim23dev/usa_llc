import { ZodError, ZodIssue } from "zod";
import { IGenericErrorResponse } from "../interface/common";
import { IGenericErrorMessage } from "../interface/error";
const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const statusCode = 400;
  const errors: IGenericErrorMessage = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  return {
    statusCode,
    message: `Validation Error:-> ${errors.map(error => `${error.path} : ${error.message}`).join(",")}`,
    // message: `Validation Error`,
    errorMessages: errors,
  };
};

export default handleZodError;