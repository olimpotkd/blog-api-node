import { NextFunction, Request, Response } from "express";

import { authorize } from "../util/jwtUtility";
import errorHandler from "../util/errorHandler";
import { JwtPayload } from "jsonwebtoken";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  //Check token
  const authUser = <JwtPayload>authorize(req);

  if (!authUser.id) {
    return next(errorHandler("Invalid/Expired token, please login back", 500));
  } else {
    //Save the userId to the request object, which will be used in the next middleware
    req.authUserId = authUser.id;
    next();
  }
};

export default isLoggedIn;
