const {Schema, model} = require("mongoose")


const daySchema = new Schema(
    {
        dia: {
            type: String,
            require: true
        },
        responsable: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Dia = new model('dia', daySchema)

module.exports = {Dia} 
