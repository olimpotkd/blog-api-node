const jwt = require("jsonwebtoken");

//Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1h" });
};

//Get token from header
const getTokenFromHeader = (req) => {
  const headers = req.headers;
  const token = headers.authorization.split(" ")[1];

  return token ? token : null;
};

//Verify token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (err, decoded) =>
    err ? err : decoded
  );
};

module.exports = { generateToken, getTokenFromHeader, verifyToken };
