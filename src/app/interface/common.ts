import { IGenericErrorMessage } from "./error";

export type IGenericResponse<T> = {
  // length: any;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  /*  errorMessages:{  
    path:string;
    message:string
  }[]; */
  // errorMessages: Array<{ path: string; message: string }>
  errorMessages: Array<IGenericErrorMessage>;
};
