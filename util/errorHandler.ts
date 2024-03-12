import { CustomError } from "../types/CustomError";

const errorHandler = (errorMessage: string, statusCode?: number) => {
  let customError: CustomError = {
    name: "Request error",
    message: errorMessage,
    status: statusCode ? statusCode : 500,
  };

  return customError;
};

export default errorHandler;
