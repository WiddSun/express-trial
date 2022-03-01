const mongoose = require('mongoose')
const Joi = require('joi')  


const Item = mongoose.model('Item', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10,
    }
}))


function validateItem(item) {
    let schema = {
        name: Joi.string().min(3).max(10).required()
    }
    return Joi.validate(item, schema)
}

module.exports.Item = Item
module.exports.validate = validateItem