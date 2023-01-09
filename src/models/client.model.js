const {Schema, model} = require("mongoose")


const clientSchema = new Schema(
    {
        fullName: {
            type: String,
            require: true
        },
        estado: {
            type: Boolean,
            default: false
        },
        medioPago:{
            type: String,
            require: true,
            default: 'efectivo'
        },
        paquete: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        telefono: {
            type: String,
            require: true
        },
        observaciones: {
            type: String,
            default: '',
            require: false
        },
        horaInicial: {
            type: String,
            default: '',
            require: false
        },
        horaFinal: {
            type: String,
            default: '',
            require: false
        },
        link: {
            type: String,
            require: false,
            default: ''
        },
        registerDay: {
            type: Schema.Types.ObjectId,
            ref: 'dias',
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Clientes = new model('clientes', clientSchema)

module.exports = {Clientes} 
