const mongoose = require('mongoose');
const Joi = require('joi')

const PostsIdeasSchema = new mongoose.Schema({
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
    idea:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    images:{
        type: Array,
        required: true,
    },
    done_at:{
        type: Date,
        required: true,
        minlength: 3,
        maxlength: 255
    }
})

const PostsIdeas = mongoose.model('PostsIdeas', PostsIdeasSchema);

function validatepostideas(post){
    const schema = {
        target_id: Joi.string().required().min(3).max(255),
        idea: Joi.string().required().min(3).max(255),
        images: Joi.array()
    }
    return Joi.validate(post,schema)
}


module.exports.PostsIdeas = PostsIdeas
module.exports.validateidea = validatepostideas