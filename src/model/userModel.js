const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please fill password area"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please fill password area"]
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps: true})


UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined
})

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}


UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 10 * (60*1000)

    return resetToken
}

module.exports = mongoose.model('User', UserSchema)