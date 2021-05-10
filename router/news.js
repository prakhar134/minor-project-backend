const express = require('express')
const router = express.Router()
const newsController = require('../controllers/news')

router.get("/global", newsController.globalNews)
router.get("/one/:name", newsController.queryNews)

module.exports = router