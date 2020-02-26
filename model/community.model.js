const mongoose = require('mongoose');
const Joi = require('joi')

const CommunitySchema = new mongoose.Schema({
    created_by:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    categories:{
        type: Array,
        required: true
    },
    name:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    description:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    type:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    profile_pic:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    cover_pic:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
},{
    timestamps: {
         createdAt: 'created_at' 
   } 
})

const Community = mongoose.model('Community', CommunitySchema);

function validateCommunity(community){
    const schema = {
        name: Joi.string().required().min(3).max(255),
        categories: Joi.array().required(),
        description: Joi.string().required().min(3).max(255),
        type: Joi.string().required().min(3).max(255)
    }
    return Joi.validate(community,schema)
}
module.exports.Community = Community
module.exports.validate= validateCommunity