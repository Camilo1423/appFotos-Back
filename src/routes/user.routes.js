const { Router } = require("express")
const { userLogin, userRegister } = require('../controller/user.controller.js')

const router = Router()

router.post('/login', userLogin)
router.post('/resgister', userRegister)

module.exports = router