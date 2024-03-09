import { CustomError } from "../types/CustomError";

const errorHandler = (error: string | Error, statusCode?: number) => {
  const message = isError(error) ? error.message : error;

  let customError: CustomError = {
    name: "Request error",
    message,
    status: statusCode ? statusCode : 500,
  };

  return customError;
};

const isError = (error: Error | string): error is Error => {
  return (error as Error).message !== undefined;
};

export default errorHandler;
