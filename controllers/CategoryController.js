const express = require('express');
const { Category, validate} = require("../model/community_Categories.model")
const { Community } = require("../model/community.model")
const _=require("lodash")

const authMiddleware = require("../middlewares/auth")
const adminMiddleware = require("../middlewares/admin")

var router = express.Router();

router.get("/", async (req,res)=>{
    try {
        let categories = await Category.find();
        if(categories) res.send(categories)

        else res.send("Failed to get Tags ").status(404)

    } catch (error) {
        res.send(error)
    }
})

router.get("/:id/communities", async (req,res)=>{
    let communities = await Community.find();
    let coms = [],k=0;
    for (let i = 0; i < communities.length; i++) {
        if(communities[i].categories.includes(req.params.id)){
            coms[k] = communities[i]
            k++;
        }
    }
    res.send(coms)
})

router.get("/:id", async (req,res)=>{
    try {
        let category = await Category.findOne({_id: req.params.id })

        if(category) return res.send(category)
        else return res.send("Tag not found ...").status(404)
    } catch (error) {
        res.send(error)
    }
})

router.post("/",[ authMiddleware, adminMiddleware ], async (req,res)=>{
    try {
        let {error} = validate(req.body)
        if(error) res.send(error).status(400)

        let categorie = await Category.findOne({name: req.body.name})
        if(categorie) return res.send("Category Already Registered ....")

        let category = new Category(_.pick(req.body,['name','description']))
        let newCategory = await category.save();

        if(newCategory) return res.send(newCategory)
        else return res.send("Failed to create a Category ...").status(400)

    } catch (error) {
        res.send(error)
    }
})

router.put("/:id",[ authMiddleware, adminMiddleware ], async(req,res)=>{
    try {
        let updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if(updatedCategory) res.send(updatedCategory)
        else res.send("Failed to updated Category ...").status(400)

    } catch (error) {
        res.send(error)
    }
})

router.delete("/:id", [ authMiddleware, adminMiddleware ], async (req,res)=>{
    try {
        let categorie = await Category.findByIdAndDelete(req.params.id);
        
        if(categorie) res.send(categorie)
        else res.send("Failed to delete category").status(400)
    } catch (error) {
        res.send(error).status(400)
    }
})
module.exports  = router