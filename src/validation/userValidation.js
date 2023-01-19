const Joi = require('joi')
const AppError = require('../utils/appError')

exports.register = async (req,res,next) => {
    const joiObject = Joi.object({
        email: Joi.string().email().min(3).max(50).email().required(),
        password: Joi.string().min(8).max(255).required(),
        passwordConfirm: Joi.string().min(8).max(255).required(),
        isActive: Joi.boolean().default(true).required()
    })

    const rb = req.body
    const validateObject = {
        email: rb.email,
        password: rb.password,
        passwordConfirm: rb.passwordConfirm,
        isActive: rb.isActive
    }

    const validate = joiObject.validate(validateObject)

    if(validate.error){
        res.status(406).send(validate.error)
    }else{
        req.vabody = validateObject
        next()
    }
}

exports.login = async (req,res,next) => {
    const joiObject = Joi.object({
        email: Joi.string().min(3).max(50).email().required(),
        password: Joi.string().min(8).max(255).required()
    })

    const rb = req.body
    const validateObject = {
        email: rb.email,
        password: rb.password
    }

    const validate = joiObject.validate(validateObject)

    if(validate.error){
        res.status(406).send(validate.error)
    }else{
        req.vabody = validateObject
        next()
    }
}
