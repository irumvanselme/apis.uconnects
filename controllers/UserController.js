const hashPassword = require('../utils/hash')
const _= require('lodash')
const express = require('express');

const { User,validate } =  require('../model/user.model')
const { Follow } = require("../model/follows.model")
const Joins = require("../model/communityJoins.model")
const { Community } = require("../model/community.model")
const { Profile } = require("../model/profile.model")
const bcrypt = require("bcrypt")

const adminMiddleware = require("../middlewares/admin")
const authMiddleware = require("../middlewares/auth")


var router = express.Router();

router.post('/follow/:user_two', authMiddleware, async (req,res)=>{
    
    try {
        let user = await User.findOne({_id: req.params.user_two})
        if(!user) return res.send("This User does not exists ....")

        let f = await Follow.findOne({$and:[
            { user_one: req.user._id },
            { user_two: req.params.user_two }
        ]})

        if(f) return res.send("Already Following ...")

        let follows = new Follow({
            user_one: req.user._id,
            user_two: req.params.user_two
        })

        let newFollow = await follows.save();

        if(newFollow) res.send(newFollow)
        else res.send("Failed to follow ...").status(400)
    } catch (error) {
        res.send(error)
    }
})

router.post('/unfollow/:user_two', authMiddleware, async (req,res)=>{

    try {
        let user = await User.findOne({_id: req.params.user_two})
        if(!user) return res.send("This User does not exists ....")

        let f = await Follow.findOne({$and:[
            { user_one: req.user._id },
            { user_two: req.params.user_two }
        ]})

        if(!f) return res.send("Not Following ...")

        let follows = await Follow.findByIdAndDelete(f._id, req.body, {new: true})

        if(follows) res.send(follows)
        else res.send("Failed to un follow ...").status(400)
    } catch (error) {
        res.send(error)
    }
})

router.get('/follows',[authMiddleware,adminMiddleware], async (req,res)=>{
    try {
        let follows = await Follow.find();
        if(follows) res.send(follows) 
    } catch (error) {
        res.send(error)
    }
})

router.get("/followers", authMiddleware , async(req,res)=>{
    try {
        let followers = await Follow.find({user_two: req.user._id})
    
        if(followers) return res.send(followers)
        else return res.send("Failed to get followers ...").status(404)
    } catch (error) {
        res.send(error)
    }
})

router.get("/following", authMiddleware , async(req,res)=>{
    try {
        let followers = await Follow.find({user_one: req.user._id})
    
        if(followers) return res.send(followers)
        else return res.send("Failed to get followers ...").status(404)

    } catch (error) {
        res.send(error)
    }
})


router.get('/mycommunities',authMiddleware, async (req, res) => {
    try {
        let coms = []
        let joins = await Joins.find({user_id: req.user._id})
        for (let i = 0; i < joins.length; i++) {
            let comunity = await Community.findOne({_id: joins[i].community_id})
            coms[i] = comunity
        }
        res.send(coms)
    } catch (error) {
        res.send(error)
    }
});

router.get('/',async (req,res)=>{
    try {
        const users = await User.find().sort({name:1});
        return res.send(users)
    } catch (error) {
        res.send(error)
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        let profile = await Profile.findOne({user_id: req.user._id})
        req.user.profile = profile

        return res.send(req.user)

    } catch (error) {
        res.send(error)
    }
});

router.get('/:id',async (req,res)=>{
    try {
        const user = await User.findOn({_id: req.params.id})

        let profile = await Profile.findOne({user_id: user._id})

        user.profile = profile

        return res.send(user)
    } catch (error) {
        res.send(error)
    }
});


router.post('/signup',async (req,res) =>{
    try {   
        const {error} = validate(req.body)
        if(error) return res.send(error.details[0].message).status(400)

        let user  = await User.findOne({$or: [
            {email: req.body.email},
            {username: req.body.username}
        ]})


        if(user) return res.send('User already Registered').status(400)

        user  = await getUserData(req);

        await user.save()

        let profile = new Profile({user_id: user._id});
        await profile.save()
        
        return res.send(_.pick(user,['_id','first_name','last_name','username','country','email'])).status(201)
    } catch (error) {
        return res.send(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        let user  = await User.findOne({$or: [
            {email: req.body.email},
            {username: req.body.username}
        ]})
        if(!user) return res.send('Invalid email or password').status(400)
    
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword) return res.send('invalid email or password').status(400)
        
        return res.send(user.generateAuthToken())
    } catch (error) {
        res.send(error)
    }
});

router.get('/checkUserName/:email', async (req, res) => {
    try {
        let user  = await User.findOne({email:req.body.email})
        if(user) return res.send('Exixts')
        else return res.send("OkToGo")
    } catch (error) {
        res.send(error)
    }
});

router.get('/checkEmail/:email', async (req, res) => {
    try {
        let user  = await User.findOne({username:req.body.username})
        if(user) return res.send('Exixts')
        else return res.send("OkToGo")
    } catch (error) {
        res.send(error)
    }
});

router.put('/account',authMiddleware, async (req, res) => {
    try {
        let newUser = await User.findByIdAndUpdate(req.user._id,req.body,{new: true});

        if(newUser) res.send("Success")
        else res.send("Failed").status(400)
    } catch (error) {
        res.send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let user  = await User.findByIdAndDelete(req.params.id)

        if(user) return res.send('Sucessfully deleted ...')
        else return res.send("Error in deletion ....")
    } catch (error) {
        res.send(error)
    }
});


// ============================= Other Functions =======================


async function getUserData(req)
{
    try {
        let user  =  new User(_.pick(req.body, ['first_name','last_name','username','country','email','password']))
        const hashed = await hashPassword(user.password)
        user.password = hashed
        return user;
    } catch (error) {
        res.send(error);
    }
    
}

module.exports = router;