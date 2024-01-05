const errorHandler = require("../util/errorHandler");
const { getTokenFromHeader, verifyToken } = require("../util/jwtUtility");

const isLoggedIn = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify the token
  const decodedUser = verifyToken(token);

  if (!decodedUser.id) {
    return next(errorHandler("Invalid/Expired token, please login back", 500));
  } else {
    //Save the userId to the request object, which will be used in the next middleware
    req.authUserId = decodedUser.id;
    next();
  }
};

module.exports = isLoggedIn;
