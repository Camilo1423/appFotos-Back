const {Schema, model} = require("mongoose")


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        username: {
            type: String,
            require: true,
            unique: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Usuarios = new model('usuarios', userSchema)

module.exports = {Usuarios} 
