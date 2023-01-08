const { Usuarios } = require("../models/index.js")
const bcrypt = require('bcryptjs')

const userRegister = async (req, res) => {
    const {fullName, email, password, username} = req.body
    try {
        await Usuarios.create({fullName, email, password: await bcrypt.hash(password, 8), username})
        return res.json({success: true})
    } catch (error) {
        return res.json({error: error})
    }
}

const userLogin = async (req, res) => {
    const usernameFront = req.body.username
    const resultUser = await Usuarios.findOne({username: usernameFront})
    if (resultUser) {
        const { _id, fullName, email, password, username } = resultUser
        const userData = { _id, fullName, email, username }
        const comparer = await bcrypt.compare(req.body.password, password)
        comparer ? res.json({response: true, ...userData }) : res.json({response: false})    
    } else {
        res.json({response: false, status: "Credential not found"})
    }
}

module.exports = {
    userLogin, userRegister
}