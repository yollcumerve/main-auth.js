const userModel = require('../model/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Response = require('../utils/response')
const { signTokenAndSend}  = require('../config/jwt')
const sendEmail = require('../config/sendEmail')
const crypto = require('crypto')

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
    
    res.status(201).json({
        status: "success",
        data: newUser
    })
})

exports.login = catchAsync( async(req,res,next) => {
    const {email, password} = req.body

    //1- Check if email or password exist 
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400))
    }

    //2- Check if user exist and password is correct 
    const user = await userModel.findOne({ email }).select("+password")

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect Email or password', 401))
    }

    //3- Everything is alright 
    signTokenAndSend(user, 200,res)
})

exports.forgotPassword = catchAsync(async (req,res,next) => {
    const {email} = req.body
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return next(new AppError('Email could not be sent',404))
        }

        const resetToken = user.getResetPasswordToken()

        await user.save()
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`
        const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try{
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            })
            res.status(200).json({success:true, data:"emailSent"})
        }catch (e) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()

            return next(new AppError("Email could not be send",500))
        }

    }catch (error) {
        next(error)
    }
})


exports.resetPassword = catchAsync(async (req,res,next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    try{
        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        })

        if(!user){
            return next(new AppError("Invalid Reset Token",400))
        }
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()
        res.status(201).json({
            status: "sucess",
            data: "Password reset success"
        })
    }catch (e) {
        next(e)
    }
})











