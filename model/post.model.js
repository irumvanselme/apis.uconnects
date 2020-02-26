const mongoose = require('mongoose');
const Joi = require('joi')

const postSchema = new mongoose.Schema({
    community_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    user_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    tags:{
        type: Array
    },
    post_title:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    post_images:{
        type: Array,
        required: true
    },
    post_body:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
})

const Post = mongoose.model('Post', postSchema);

function validatepost(post){
    const schema = {
        community_id: Joi.string().required().min(3).max(255),
        post_title: Joi.string().required().min(3).max(255),
        post_images: Joi.array(),
        tags: Joi,
        post_body: Joi.string().required().min(3).max(255)
    }
    return Joi.validate(post,schema)
}
module.exports.Post = Post
module.exports.validate= validatepost