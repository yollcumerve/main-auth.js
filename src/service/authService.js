const userModel = require('../model/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Response = require('../utils/response')
const { signTokenAndSend}  = require('../config/jwt')


exports.register = catchAsync( async (req,res,next) => {
    const rb = req.body
    const check = await userModel.findOne({email: rb.email})
    if(check){
        return next(new AppError('EmailisValid',401))
    }
        const newUser = await userModel.create({
            email: rb.email,
            password: rb.password,
            passwordConfirm: rb.passwordConfirm,
            isActive: rb.isActive
        })
    
    signTokenAndSend(newUser,201,res)
})

exports.login = catchAsync( async(req,res,next) => {
    const {email, password} = req.body

    //1- Check if email or password exist 
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400))
    }

    //2- Check if user exist and password is correct 
    const user = await userModel.findOne({ email })

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect Email or password', 401))
    }

    //3- Everything is alright 
    signTokenAndSend(user, 200,res)
})

exports.forgotPassword = catchAsync(async (req,res,next) => {

})


exports.resetPassword = catchAsync(async (req,res,next) => {

})











