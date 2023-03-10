const router = require('express').Router()
const authService = require('../service/authService')
const authValidation = require('../validation/userValidation')
const {verifyToken} = require('../config/jwt')

router.post('/register', authValidation.register, authService.register)


router.post('/login', authValidation.login, verifyToken, authService.login)

router.post('/forgotPassword', authService.forgotPassword)

router.put('/resetPassword/:resetToken', authService.resetPassword)

module.exports = router