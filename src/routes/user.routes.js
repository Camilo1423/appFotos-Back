const { Router } = require("express")
const { userLogin, userRegister, updateUser } = require('../controller/user.controller.js')

const router = Router()

router.post('/login', userLogin)
router.post('/register', userRegister)
router.put('/update/:id', updateUser)

module.exports = router