const { Router } = require('express')
const { updateCliente, getCliente, deleteCliente, registerHours } = require('../controller/client.controller.js')

const router = Router()

router.get('/:id', getCliente)
router.put('/update/:id', updateCliente)
router.put('/hours/update/:id', registerHours)
router.delete('/update/:id', deleteCliente)


module.exports = router