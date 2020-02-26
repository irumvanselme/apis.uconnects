const config = require('config')
const jwt  =  require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('x-auth-token')
    if(!token) return res.send('token missing..').status(401)
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    } catch (err) {
       return  res.send('invalid token').status(400)
    }
}
module.exports = auth