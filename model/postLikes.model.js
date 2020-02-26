const mongoose = require('mongoose');
const Joi = require('joi')

const PostsLikesSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    post_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    target_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    done_at:{
        type: Date,
        required: true,
        minlength: 3,
        maxlength: 255
    }
})

const PostsLikes = mongoose.model('PostsLikes', PostsLikesSchema);

module.exports.PostsLikes = PostsLikes
