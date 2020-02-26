const express = require('express');
const { Tag,validate } = require("../model/tags.model")
const _=require("lodash")

const authMiddleware = require("../middlewares/auth")
const adminMiddleware = require("../middlewares/admin")

var router = express.Router();

router.get("/", async (req,res)=>{
    try {
        let tags = await Tag.find();
        if(tags) res.send(tags)
        else res.send("Failed to get Tags ").status(404)

    } catch (error) {
        res.send(error)
    }
})

router.get("/:id", async (req,res)=>{
    try {
        let tag = await Tag.findOne({_id: req.params.id })
        if(tag) res.send(tag)
        else res.send("Tag not found ...").status(404)
    } catch (error) {
        res.send(error)
    }
})

router.post("/", async (req,res)=>{
    try {
        let {error} = await validate(req.body)
        if(error) res.send(error.details[0].message)

        let t = await Tag.findOne({name: req.body.name})
        if(t) return res.send("Tag Already Exists ...").status(400)

        let tag = new Tag(_.pick(req.body,['name']))
        let newTag = await tag.save();

        if(newTag) res.send(newTag)
        else res.send("Failed to create a tag ...").status(400)
    } catch (error) {
        res.send(error)
    }
})

router.put("/:id", async(req,res)=>{
    try {
        let updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if(updatedTag) res.send(updatedTag)
        else res.send("Failed to updated tag ...").status(400)

    } catch (error) {
        res.send(error)
    }
})

router.delete("/:id", [authMiddleware,adminMiddleware], async (req,res)=>{
    try {
        let tag = await Tag.findByIdAndDelete(req.params.id)

        if(tag) res.send(tag)
        else res.send("Failed to delete tag ...").status(400)

    } catch (error) {
        res.send(error)
    }
})
module.exports  = router