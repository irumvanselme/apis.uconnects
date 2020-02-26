const mongoose = require('mongoose');
const Joins = mongoose.model("CommunityJoins")

module.exports = async function(req,res,next){
    try {
        let joins = await  Joins.findOne({community_id: req.body.community_id,user_id:req.user._id}) 
        if(!joins) res.send("You does not belong to this community ")
        next()
    } catch (error) {
        res.send(error)
    }
}