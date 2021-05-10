const express = require('express')
const router = express.Router()
const tradeController = require('../controllers/trade')
const auth = require('../middleware/auth')

router.post('/buy', auth, tradeController.buyStock)
router.post('/sell', auth, tradeController.sellStock)
router.get('/get/:id', auth, tradeController.getTrade)

module.exports = router