const mongoose = require('mongoose');
const Joi = require('joi')

const followsSchema = new mongoose.Schema({
    user_one: {
        type: String,
        required: true
    },
    user_two: {
        type: String,
        required: true
    },
},{
     timestamps: {
          createdAt: 'done_at' 
    } 
})

const Follow = mongoose.model('Follow', followsSchema);

function validateFollow(post){
    const schema = {
        user_two: Joi.string().required()
    }
    return Joi.validate(post,schema)
}

module.exports.Follow = Follow
module.exports.validate= validateFollow