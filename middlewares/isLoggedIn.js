const { getTokenFromHeader, verifyToken } = require("../util/jwtUtility");

const isLoggedIn = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify the token
  const decodedUser = verifyToken(token);

  if (!decodedUser.id) {
    return res.json({
      message: "Invalid/Expired token, please login back",
    });
  } else {
    //Save the userId to the request object, which will be used in the next middleware
    req.authUserId = decodedUser.id;
    next();
  }
};

module.exports = isLoggedIn;
