const User = require("../model/User");
const errorHandler = require("../util/errorHandler");
const { getTokenFromHeader, verifyToken } = require("../util/jwtUtility");

const isAdmin = async (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify the token
  const decodedUser = verifyToken(token);

  //Find user in DB to check if admin
  const user = await User.findById(decodedUser.id);

  if (user.isAdmin) {
    return next();
  } else {
    return next(errorHandler("Access Denied", 403));
  }
};

module.exports = isAdmin;
