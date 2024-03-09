import { CustomError } from "../types/CustomError";

const errorHandler = (message: string, statusCode?: number) => {
  let error: CustomError = {
    name: "Request error",
    message,
    status: statusCode ? statusCode : 500,
  };

  return error;
};

export default errorHandler;
