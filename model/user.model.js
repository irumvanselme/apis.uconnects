const mongoose = require('mongoose');
const Joi = require('joi')
const jwt  =  require('jsonwebtoken')
const config = require('config')

var userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 3
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 3
    },
    username:{
        type: String,
        required: true,
        unique: true,
        maxlength: 255,
        minlength: 3
    },
    country: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 3
    },
    isAdmin:{
        type: Boolean,
        required: false,
        default: false
    }
});
userSchema.methods.generateAuthToken = function(){
    const token  =jwt.sign({
        _id: this._id,
        first_name: this.first_name,
        last_name: this.last_name,
        username: this.username,
        country: this.country,
        email: this.email,
        profile_pic: this.profile_pic
    }
    ,config.get('jwtPrivateKey'))
    return token
}
const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        first_name: Joi.string().required().min(3).max(255),
        last_name: Joi.string().required().min(3).max(255),
        country: Joi.string().required().min(3).max(255),
        email: Joi.string().required().min(3).max(255),
        username: Joi.string().required().min(3).max(255),
        password: Joi.string().required().min(3).max(255)
    }
    return Joi.validate(user,schema)
}
module.exports.User = User
module.exports.validate= validateUser