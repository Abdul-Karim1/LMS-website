const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYAPI";
const User = require("../Models/User");
const asyncHandler = require("express-async-handler");

const auth = asyncHandler(async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      console.log("-->", token);
      const decodedUser = jwt.verify(token, SECRET_KEY);
      req.userId = decodedUser.id;
      console.log("Value  ------", req.userId);
      console.log("MIDLEWARE:", req.user);
      next();
    } else {
      return res.status(401).json({ message: "UNAUTHORIZED USER" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized user" });
  }
});

module.exports = auth;
