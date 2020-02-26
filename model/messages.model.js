const mongoose = require('mongoose');
const Joi = require('joi')

const messageSchema = new mongoose.Schema({
    sender_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    reciever_id:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    message:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    status:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
},{
    timestamps: {
         createdAt: 'done_at' 
   } 
})

const Message = mongoose.model('Message', messageSchema);

function validateMessage(Message){
    const schema = {
        reciever_id: Joi.string().required().min(3).max(255),
        message: Joi.string().required(),
        status: Joi.string().required(),
    }
    return Joi.validate(Message,schema)
}
module.exports.Message = Message
module.exports.validate= validateMessage