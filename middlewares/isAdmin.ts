import { NextFunction, Request, Response } from "express";

import { authorize } from "../util/jwtUtility";
import errorHandler from "../util/errorHandler";
import { JwtPayload } from "jsonwebtoken";
import User from "../model/User";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  //Check token
  const authUser = authorize(req);

  if (!authorize) {
    return next(errorHandler("Access Denied", 403));
  }

  const user = await User.findById((authUser as JwtPayload).id);

  if (user?.isAdmin) {
    return next();
  } else {
    return next(errorHandler("Access Denied", 403));
  }
};

export default isAdmin;
