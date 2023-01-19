const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please fill password area"]
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please fill password area"]
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
}, {timestamps: true})


UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined
})

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}


module.exports = mongoose.model('User', UserSchema)