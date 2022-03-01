const mongoose = require('mongoose')
const Joi = require('joi')


const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10,
    },
    isGold: {type: Boolean, default: false},
    email: {type: String}
}))


function validateUser(user) {
    let schema = {
        name: Joi.string().min(3).max(10).required(),
        email: Joi.string(),
        isGold: Joi.Boolean(),
    }
    return Joi.validate(user, schema)
}

module.exports.User = User
module.exports.validate = validateUser