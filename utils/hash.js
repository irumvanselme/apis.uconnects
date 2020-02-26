const bcrypt = require('bcrypt')
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password,salt)
    return hashed
}
module.exports = hashPassword
