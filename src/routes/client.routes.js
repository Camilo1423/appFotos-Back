const { Router } = require('express')
const { updateCliente, getCliente, deleteCliente, registerHours, getClient } = require('../controller/client.controller.js')

const router = Router()

router.get('/:id', getCliente)
router.get('/single/:id', getClient)
router.put('/update/:id', updateCliente)
router.put('/hours/update/:id', registerHours)
router.delete('/update/:id', deleteCliente)


module.exports = router