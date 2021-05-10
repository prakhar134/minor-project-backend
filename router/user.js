const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/auth')

router.post("/register", auth, userController.register)
router.get("/current", auth, userController.currentPosition)
router.get("/past", auth, userController.pastPosition)

module.exports = router