const { Router } = require('express')
const { insertDay, deleteDay, getDay } = require('../controller/registerDay.controller.js')

const router = Router()

router.get('/', getDay)
router.post('/register', insertDay)
router.delete('/delete/:id', deleteDay)


module.exports = router