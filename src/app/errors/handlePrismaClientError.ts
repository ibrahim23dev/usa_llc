import { IGenericErrorMessage } from "../interface/error";
import { Prisma } from "../adapters/Prisma/interface.prisma";

const handlePrismaClientError = (error: unknown) => {
  console.log("🚀 ~ handlePrismaClientError ~ error:", error);
  let errors: IGenericErrorMessage[] = [];
  let message = "Something went wrong!";
  const statusCode = 400;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        message = "Input value is too long for the column.";
        break;
      case "P2001":
        message = "Record not found.";
        break;
      case "P2002":
        message = "Unique constraint failed.";
        errors = [
          {
            path: (error.meta?.target as string[])?.join(", ") || "",
            message: "Duplicate value for unique field(s).",
          },
        ];
        break;
      case "P2003":
        message = "Foreign key constraint failed.";
        if (error.message.includes("delete()` invocation:")) {
          message = "Delete failed due to related records.";
        }
        errors = [{ path: "", message }];
        break;
      case "P2025":
        message = (error.meta?.cause as string) || "Record not found!";
        errors = [{ path: "", message }];
        break;
      default:
        message = error.message;
        break;
    }
  }
  if (errors.length === 0) {
    errors = [{ path: "", message }];
  }

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handlePrismaClientError;
