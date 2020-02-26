const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer")

const { Community, validate } = require("../model/community.model")
const { Category } = require("../model/community_Categories.model")
const Joins = mongoose.model('CommunityJoins')

const authMiddleware = require("../middlewares/auth")
const checkValidUserId = require("../middlewares/checkUserExists")
const adminMiddleware = require("../middlewares/admin")

var router = express.Router();

var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        cb(null, './public/profiles/communities/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        let communities = await Community.find()
        if (communities) return res.send(communities)
        else res.send("Failed to get Communities ")
    } catch (error) {
        res.send(error)
    }
});

router.get('/joins', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        let joins = await Joins.find();
        res.send(joins)
    } catch (error) {
        res.send(error)
    }
});

router.post('/', [authMiddleware, checkValidUserId], async (req, res) => {
    try {
        let {error} = await validate(req.body)
        if(error) return res.send(error.details[0].message)

        for (let i = 0; i < req.body.categories.length; i++) {
            let category = await Category.findOne({ _id: req.body.categories[i] })
            if (!category) return res.send("Category with " + req.body.categories[i] + " does not exist ...")
        }

        let com = await Community.findOne({ name: req.body.name })
        if (com) return res.send("Community already registered ....")

        let community = new Community({
            created_by: req.user._id,
            name: req.body.name,
            description: req.body.description,
            categories: req.body.categories,
            type: req.body.type,
            cover_pic: 'c_cover_avatar.jpg',
            profile_pic: 'c_profile_avatar.jpg'
        })
        let newCommunity = await community.save()

        let joined = new Joins({
            community_id: newCommunity._id,
            user_id: req.user._id,
            done_at: new Date().toISOString()
        })
        await joined.save();

        if (newCommunity && joined) return res.send(newCommunity)
        else return res.send("Failed to create New Community ....")
    } catch (error) {
        res.send(error)
    }
});
router.post('/join/:community_id', [authMiddleware, checkValidUserId], async (req, res) => {
    try {
        let cjoined = await Joins.findOne({
            user_id: req.user._id,
            community_id: req.params.community_id,
        })
        if (cjoined) return res.send("User Already Joined .....")
    
        let joined = new Joins({
            community_id: req.params.community_id,
            user_id: req.user._id,
            done_at: new Date().toISOString()
        })
        let j = await joined.save();
        if (j) res.send(j)
        else res.send("Failed to create joins ..")
    } catch (error) {
        res.send(error)
    }
});

router.post('/unjoin/:community_id', [authMiddleware, checkValidUserId], async (req, res) => {
    try {
        let cjoined = await Joins.findOne({
            user_id: req.user._id,
            community_id: req.params.community_id,
        })
        if (!cjoined) return res.send("User don't exist Joined .....")
    
        let joined = await Category.findByIdAndDelete(cjoined._id)
    
        let j = await joined.save();
        if (j) res.send(j)
        else res.send("Failed to create joins ..")
    } catch (error) {
        res.send(error)
    }
});

router.put("/:id", authMiddleware, async (req,res)=>{
    try {
        let newCommunity = await Community.findByIdAndUpdate(req.params.is, req.body, {new: true})
        if(newCommunity) return res.send(newCommunity)
        else return res.send("Failed to update the community ..").status(400)
    } catch (error) {
        res.send(error)
    }

})

router.put("/:id/changeCoverPic", upload.single('cover_pic') , async (req,res)=>{
    try {
        let community = await Community.findOne({_id: req.params.id})
        if(!community) return res.send("Invalid Community Id ")

        req.body.cover_pic = req.file.filename;
        let newCommunity = await Community.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(newCommunity) return res.send(newCommunity)
        else return res.send("Failed to update the community ..").status(400)

    } catch (error) {
        res.send(error)
    }
})

router.put("/:id/changeProfilePic",upload.single('profile_pic'), authMiddleware, async (req,res)=>{
    try {
        let community = await Community.findOne({_id: req.params.id})
        if(!community) return res.send("Invalid Community Id ")

        req.body.profile_pic = req.file.filename;
        
        let newCommunity = await Community.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(newCommunity) return res.send(newCommunity)
        else return res.send("Failed to update the community ..").status(400)

    } catch (error) {
        res.send(error)
    }
})

router.delete('/:id', authMiddleware , async (req, res) => {
    try {
        let community = await Community.findByIdAndDelete(req.params.id);
        if (community) res.send(community)
        else res.send('Failed to delete the community ')
    } catch (error) {
        res.send(error)
    }
});

module.exports = router

