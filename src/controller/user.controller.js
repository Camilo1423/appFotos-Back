const { Usuarios } = require("../models/index.js")
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcryptjs')
const fse = require('fs-extra')

// configuracion de cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const userRegister = async (req, res) => {
    const {fullName, email, password, username, genero, role} = req.body
    const urlLabel = genero == 'male' ? process.env.MAN : process.env.WOMAN 
    try {
        await Usuarios.create({fullName, email, password: await bcrypt.hash(password, 8), username: username.toLowerCase(), urlLabel, genero, role})
        return res.json({success: true})
    } catch (error) {
        return res.json({error: error})
    }
}

const userLogin = async (req, res) => {
    const usernameFront = req.body.username.toLowerCase()
    const resultUser = await Usuarios.findOne({username: usernameFront})
    if (resultUser) {
        const { _id, fullName, email, password, username, urlLabel, genero, role} = resultUser
        const userData = { _id, fullName, email, username, urlLabel, genero, role}
        const comparer = await bcrypt.compare(req.body.password, password)
        comparer ? res.json({response: true, ...userData }) : res.json({response: false})    
    } else {
        res.json({response: false, status: "Credential not found"})
    }
}

const updateUser = async (req, res) => {
    try {
        const {fullName, email, username } = req.body
        const userFind =  await Usuarios.findOne({_id: req.params.id})
        let image = req.file ?  req.file.path : null
        let imageLoad = userFind.urlLabel
        let keyLoad = userFind.publicId
        if(image != null && userFind.publicId != '') {
            cloudinary.uploader.destroy(userFind.publicId)
            const { public_id } = await cloudinary.uploader.upload(image, {quality: 50})
            const imageTransform = cloudinary.url(public_id, {transformation: [{ width: 500, height: 500, gravity: 'faces', crop: 'fill' }]})
            imageLoad = imageTransform
            keyLoad = public_id
            await fse.unlink( image )
        } else if (image != null) {
            const { public_id } = await cloudinary.uploader.upload(image, {quality: 50})
            const imageTransform = cloudinary.url(public_id, {transformation: [{ width: 500, height: 500, gravity: 'faces', crop: 'fill' }]})
            imageLoad = imageTransform
            keyLoad = public_id
            await fse.unlink( image )
        }
        const userUpdate = {_id: userFind._id, fullName, email, username: username.toLowerCase(), genero: userFind.genero, role: userFind.role, urlLabel: imageLoad}
        await Usuarios.updateOne({_id: req.params.id},{fullName, email, username: username.toLowerCase(), urlLabel: imageLoad, publicId: keyLoad}, {runValidators: true})
        return res.status(200).json({response: true, ...userUpdate })
    } catch (error) {
        return res.status(500).json(error)
    }

}

module.exports = {
    userLogin, userRegister, updateUser
}