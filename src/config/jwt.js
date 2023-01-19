const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require('../model/userModel')
const AppError = require('../utils/appError')

const signTokenAndSend = catchAsync(async (user,statusCode, res) => {
  const data = {
    sub: user._id,
  };

  const token = await jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  //REMOVE PASSWORD FROM OUTPUT
  user.password = undefined;

  res.status(statusCode).send({
    status: "success",
    token, 
    data: {
        user
    }
  })
});

const verifyToken = catchAsync(async(req,res,next) => {
   // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.sub).select(" _id email")
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
})



module.exports = {signTokenAndSend, verifyToken}
