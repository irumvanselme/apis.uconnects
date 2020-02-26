const express = require('express');
const { Message,validate } = require("../model/messages.model")
const { Follow } = require("../model/follows.model")
const { User } = require("../model/user.model")
const _=require("lodash")
const authMiddleware = require("../middlewares/auth")

var router = express.Router();

router.get("/chat/:user_id", async (req,res)=>{
    try {
        let messages = await Message.find({$or:[
            {
                $and:[
                    {reciever_id: req.params.id},
                    {sender_id: req.user._id}
                ]
            },
            {
                $and:[
                    {reciever_id: req.user._id},
                    {sender_id: req.params.id}
                ]
            }
        ]});
        if(messages) res.send(messages)
        else res.send("Failed to get messages ").status(404)

    } catch (error) {
        res.send(error)
    }
})

router.get("/:id", async (req,res)=>{
    try {
        let message = await Message.findOne({_id: req.params.id })
        if(message) res.send(message)
        else res.send("message not found ...").status(404)
    } catch (error) {
        res.send(error)
    }
})

router.post("/:user_id", authMiddleware , async (req,res)=>{
    try {
        let {error} = await validate(req.body)
        if(error) res.send(error.details[0].message)

        let user = await User.findOne({_id: req.params.user_id})
        if(!user) return res.send("User Not found ....")

        let follows = await getFollows(req.user._id)

        if(!follows.includes(req.params.user_id)) return res.send("You don't follow this boy")

        res.body.reciever_id = req.params.user_id
        req.body.sender_id = req.user._id

        let message = new Message(_.pick(req.body,['sender_id','reciever_id','message','status']))
        let newmessage = await message.save();

        if(newmessage) res.send(newmessage)
        else res.send("Failed to create a message ...").status(400)
    } catch (error) {
        res.send(error)
    }
})

router.put("/:id", async(req,res)=>{
    try {
        let updatedmessage = await Message.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if(updatedmessage) res.send(updatedmessage)
        else res.send("Failed to updated message ...").status(400)

    } catch (error) {
        res.send(error)
    }
})


async function getFollows(user_id){
    let follows = await Follow.find({user_one: user_id})
    let result = new Array();
    for(let i = 0; i < follows.length ; i++)
        result[i] = follows[i].user_two

    return result
}

module.exports  = router