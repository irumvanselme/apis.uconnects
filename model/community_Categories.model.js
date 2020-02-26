const mongoose = require('mongoose');
const Joi = require('joi')

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false
    }
})

const Category = mongoose.model('Category', categorySchema);

function validateCategory(post){
    const schema = {
        name: Joi.string().required().min(3).max(255),
        description: Joi.string().min(3).max(255)
    }
    return Joi.validate(post,schema)
}

module.exports.Category = Category
module.exports.validate= validateCategory