const express = require('express');
const { Profile, validate } = require("../model/profile.model")
const _=require("lodash")
const multer = require("multer")

const authMiddleware = require("../middlewares/auth")

var router = express.Router();

var router = express.Router();

var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        cb(null, './public/profiles/users/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.put('/' ,authMiddleware, async (req,res)=>{
    try {
        let {error} = await validate(req.body)
        if(error) return res.send(error.details[0].message)

        let profile = await Profile.findOneAndUpdate({user_id: req.user._id}, req.body, {new: true})

        if(profile) res.send(profile)
        else res.send("Failed to update ... ").status(400)

    } catch (error) {
        res.send(error)
    }
})

router.put("/changeCoverPic",[upload.single('cover_pic'),authMiddleware], async(req,res)=>{
    try {
        req.body.cover_pic = req.file.filename

        let profile = await Profile.findOneAndUpdate({user_id: req.user._id}, req.body, {new: true})

        if(profile) res.send(profile)
        else res.send("Failed to update ... ").status(400)
    } catch (error) {
        res.send(error)
    }
})

router.put("/changeProfilePic",[upload.single('cover_pic'),authMiddleware], async(req,res)=>{
    try {
        req.body.profile_pic = req.file.filename

        let profile = await Profile.findOneAndUpdate({user_id: req.user._id}, req.body, {new: true})

        if(profile) res.send(profile)
        else res.send("Failed to update ... ").status(400)
    } catch (error) {
        res.send(error)
    }
})
module.exports = router