const express = require('express');
const _=require("lodash")
const multer = require("multer")

const { Post, validate } = require("../model/post.model")
const Joins = require("../model/communityJoins.model")
const { Follow } = require("../model/follows.model")
const { PostsIdeas, validateidea } = require("../model/postIdeas.model")
const { PostsLikes } = require("../model/postLikes.model")
const { Tag } = require("../model/tags.model")

const authMiddleware = require("../middlewares/auth")
const checkValidUserId = require("../middlewares/checkUserExists")
const checkInCommunity = require("../middlewares/checkInCommunity")

var router = express.Router();

var router = express.Router();

var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        cb(null, './public/posts/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });


router.get('/', async (req, res) => {
    try {
        let posts = await Post.find()
        if(posts) return res.send(posts)
        else return res.send("Failed to get all posts ").status(404)
    } catch (error) {
        res.send(error)
    }
});

router.get('/home',[authMiddleware,checkValidUserId], async (req, res) => {
    try {
        let posts = []
        let follows = await getFollows(req.user._id);
        let joins = await getJoins(req.user._id);
        let post = await Post.find();
        let z = 0;
        for (let i = 0; i < post.length; i++) {
            if(follows.includes(post[i].user_id) || joins.includes(post[i].community_id)){
                posts[z] = post[i]
                z++;
            }
        }

        res.send(posts)
    } catch (error) {
        res.send(error)
    }
});


router.get("/:community_id", async (req,res)=>{
    try {
        let posts = await Post.find({community_id: req.params.community_id})
        if(posts) return res.send(posts)
        else return res.send("Failed to get all posts ").status(404)
    } catch (error) {
        res.send(error)
    }
})

router.post('/',[ upload.array('post_images'),authMiddleware,checkValidUserId,checkInCommunity], async(req, res) => {
    try {
        let {error} = await validate(req.body)
        if(error) return res.send(error.details[0].message).status(400)

        if(req.body.tags){
            for (let i = 0; i < req.body.tags.length; i++) {
                let category = await Tag.findOne({_id: req.body.tags[i]})
                if(!category) return res.send("Category with "+req.body.tags[i]+" does not exist ...")
            }
        }
        req.body.post_images = []
        if(req.body.files){
            for (let i = 0; i < req.files.length; i++){
                req.body.post_images[i] = req.files[i].filename
            }
        }

        req.body.user_id = await req.user._id
        let post = new Post(_.pick(req.body,['community_id','user_id','post_title','tags','post_images','post_body']))

        let npost = await post.save();

        if(npost) return res.send(npost)
        else return res.send("Failed to add Post ")
    } catch (error) {
        res.send(error)
    }
});

router.get('/:post_id/comments', async (req, res) => {
    try {
        let comments = await PostsIdeas.find({
            post_id: req.params.post_id,
            target_id: 'this'
        })
        if(comments) return res.send(comments)
        else return res.send("Failed o get comments of this post ")
    } catch (error) {
        res.send(error)
    }
});


router.get('/:post_id/comments/:target_id', async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.post_id})
        if(!post) return res.send("Post does not exists .......")

        let comments = await PostsIdeas.find({
            post_id: req.params.post_id,
            target_id: req.params.target_id
        })
        if(comments) return res.send(comments)
        else return res.send("Failed o get comments of this post ")
    } catch (error) {
        res.send(error)
    }
});



router.post('/:post_id/comment',[ upload.array('images'),authMiddleware,checkValidUserId], async (req, res) => {
    try {
        let {error} = await validateidea(req.body)
        if(error) res.send(error.details[0].message)

        let post = await Post.find({_id: req.params.post_id})
        if(!post) return res.send("Post does not exists .......")

        req.body.images = []

        if(req.files[0]){
            for (let i = 0; i < req.files.length; i++) {
                req.body.images[i] = req.files[i].filename
            }
        }

        req.body.user_id = await req.user._id
        req.body.post_id = req.params.post_id
        req.body.done_at = new Date().toISOString()

        let idea = new PostsIdeas(_.pick(req.body,['user_id','post_id','target_id','idea','images','done_at']))
        let newIdea = await idea.save()

        if(newIdea) return res.send(newIdea)
        else res.send("Failed to send Your idea")
    } catch (error) {
        res.send(error)
    }
});

router.get('/:post_id/likes', async (req, res) => {
    try {
        
        let likes = await PostsLikes.find({
            post_id: req.params.post_id,
            target_id: 'this'
        })
        if(likes) return res.send(likes)
        else return res.send("Failed o get likes of this post ")
    } catch (error) {
        res.send(error)
    }
});


router.post('/:post_id/like',[authMiddleware,checkValidUserId], async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.post_id})
        if(!post) return res.send("Post does not exists .......")

        let like = await PostsLikes.findOne({
            user_id: req.user._id,
            post_id: req.params.post_id,
            target_id: req.body.target_id
        })

        if(like) return res.send("Already Liked ...")

        req.body.user_id = await req.user._id
        req.body.post_id = req.params.post_id
        req.body.done_at = new Date().toISOString()

        let idea = new PostsLikes(_.pick(req.body,['user_id','post_id','target_id','done_at']))
        let newIdea = await idea.save()

        if(newIdea) return res.send(newIdea)
        else res.send("Failed to send Your idea")
    } catch (error) {
        res.send(error)
    }
});

router.post('/:post_id/unlike',[authMiddleware,checkValidUserId], async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.post_id})
        if(!post) return res.send("Post does not exists .......")

        let like = await PostsLikes.findOne({
            user_id: req.user._id,
            post_id: req.params.post_id,
            target_id: req.body.target_id
        })

        if(!like) return res.send("You don't like ...")

        let mylike = await PostsLikes.findByIdAndDelete(like._id)
        let newLike = await mylike.save()

        if(newLike) return res.send(newLike)
        else res.send("Failed to send Your Like")
    } catch (error) {
        res.send(error)
    }
});


router.get('/:post_id/likes/:target_id', async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.post_id})
        if(!post) return res.send("Post does not exists .......")

        let likes = await PostsLikes.find({
            post_id: req.params.post_id,
            target_id: req.params.target_id
        })
        if(likes) return res.send(likes)
        else return res.send("Failed o get comments of this post ")
    } catch (error) {
        res.send(error)
    }
});

async function getFollows(user_id){
    let follows = await Follow.find({user_one: user_id})
    let result = new Array();
    for(let i = 0; i < follows.length ; i++)
        result[i] = follows[i].user_two

    return result
}
async function getJoins(user_id){
    let joins = await Joins.find({user_id: user_id})
    let result = new Array();
    for(let i = 0; i < joins.length ; i++)
        result[i] = joins[i].community_id

    return result
}

module.exports  = router