import { IGenericErrorResponse } from "../interface/common";
import { Prisma } from "../adapters/Prisma/interface.prisma";

const handleValidationPrismaError = (
  error: Prisma.PrismaClientValidationError,
): IGenericErrorResponse => {
  console.log("🚀 ~ handleValidationPrismaError:", error);
  const statusCode = 400;
  const defaultMessage = "Validation Error";

  // PrismaClientValidationError messages are often hard to parse directly.
  // You can use regex or simple string matching to extract fields from the message if needed.
  const fieldMatch = error.message.match(/Argument `(\w+)`/);
  const field = fieldMatch ? fieldMatch[1] : "";

  const errors = [
    {
      path: field,
      message: error.message,
    },
  ];

  return {
    statusCode,
    message: defaultMessage,
    errorMessages: errors,
  };
};

export default handleValidationPrismaError;

// import { IGenericErrorResponse } from "../interface/common";

// const handleValidationPrismaError = (
//   error: Prisma.PrismaClientValidationError,
// ): IGenericErrorResponse => {
//   const errors = [
//     {
//       path: "",
//       message: error.message,
//     },
//   ];
//   const statusCode = 400;
//   return {
//     statusCode,
//     message: "Validation Error",
//     errorMessages: errors,
//   };
// };

// export default handleValidationPrismaError;
