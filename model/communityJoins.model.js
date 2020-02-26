const mongoose = require('mongoose');
const Joi = require('joi')

const CommunityJoinsSchema = new mongoose.Schema({
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
    done_at:{
        type: Date,
        required: true,
        minlength: 3,
        maxlength: 255
    }
})

const CommunityJoins = mongoose.model('CommunityJoins', CommunityJoinsSchema);

module.exports = CommunityJoins