const {Dia, Clientes} = require('../models/index.js');

const insertDay = async (req, res) => {
    const {dia, responsable} = req.body;
    try {
        await Dia.create({ dia, responsable})
        return res.status(200).json({status: 200})
    } catch (error) {
        return res.status(500).json({status: error})
    }
}

const deleteDay = async (req, res) => {
    try {
        await Clientes.deleteMany({registerDay: {$eq: req.params.id}})
        await Dia.remove({_id: {$eq: req.params.id}})
        return res.status(200).json({status: 200})
    } catch (error) {
        return res.status(500).json({status: error})
    }
}

const getDay = async (req, res) => {
    try {
        const dias = await Dia.aggregate([
            { 
                $sort: { createdAt: -1 }
            }])
        return res.status(200).json(dias)
    } catch (error) {
        return res.status(500).json({status: error})
    }
}

module.exports = { insertDay, deleteDay, getDay}