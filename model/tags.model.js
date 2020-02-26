const mongoose = require('mongoose');
const Joi = require('joi')

const tagsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    }
})

const Tag = mongoose.model('Tag', tagsSchema);

function validateTag(post){
    const schema = {
        name: Joi.string().required().min(3).max(255)
    }
    return Joi.validate(post,schema)
}

module.exports.Tag = Tag
module.exports.validate= validateTag