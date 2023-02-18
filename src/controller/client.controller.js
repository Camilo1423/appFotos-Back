const { Clientes } = require("../models/index.js")
const mongoose = require("mongoose")

const updateCliente = async (req, res) => {
    const {fullName, medioPago, paquete, email, telefono, observaciones, horaInicial, horaFinal} = req.body;
    try {
        await Clientes.updateOne({_id: {$eq: req.params.id}}, {fullName, medioPago, paquete, email, telefono, observaciones, horaInicial, horaFinal})
        return res.status(200).json({message: "Cliente actualizado con exitos"})
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

const registerHours = async (req, res) => {
    const {horaInicial, horaFinal} = req.body;
    try {
        await Clientes.updateOne({_id: {$eq: req.params.id}}, {horaInicial, horaFinal})
        return res.status(200).json({status: 200})
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

const getCliente = async (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id)
    try {
        const clients = await Clientes.find({registerDay: {$eq: id}})
        return res.status(200).json(clients)
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

const deleteCliente = async (req, res) => {
    try {
        await Clientes.deleteOne({_id: req.params.id})
        return res.status(200).json({message: "Cliente eliminado con exitos"})
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

const getClient = async (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id)
    try {
        const cliente = await Clientes.findOne({_id: {$eq: id}})
        return res.status(200).json(cliente)
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

module.exports = { deleteCliente, getCliente, updateCliente, registerHours, getClient }