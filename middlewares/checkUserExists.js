const mongoose = require('mongoose');
const User = mongoose.model("User")

module.exports = async function(req,res,next){
    try {
        let user = await User.findById(req.user._id)
        if(!user) return res.send("User is not registered .....")   
        next()
    } catch (error) {
        res.send(error)
    }
}