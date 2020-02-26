const mongoose = require('mongoose');
const Joi = require('joi')

const profileSchema = new mongoose.Schema({
    user_id:{ type: String, required: true },
    profile_pic: { type: String },
    cover_pic: { type: String },
    short_bio: { type: String },
    website: { type: String },
    intrests:{ type: Array },
    current_city: { type: String },
    home_city: { type: String },
    education:{ type: Array },
    work_place:{ type: Array },
    birth_date:{ type: Date },
    gender: { type: String },
    phone:{ type: Array }
})

const Profile = mongoose.model('Profile', profileSchema);

function validateProfile(post){
    const schema = {
        profile_pic: Joi.string().min(3).max(5),
        short_bio: Joi.string().min(3).max(5),
        website: Joi.string().min(3).max(5),
        intrests: Joi.array(),
        current_city: Joi.string().min(3).max(5),
        home_city: Joi.string().min(3).max(5),
        education: Joi.array(),
        work_place: Joi.array(),
        birth_date: Joi.date(),
        gender: Joi.string().min(3).max(5),
        phone: Joi.array()
    }
    return Joi.validate(post,schema)
}

module.exports.Profile = Profile
module.exports.validate= validateProfile