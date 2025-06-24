const userController = require("../controllers/userController.js")
const router = require('express').Router()
const authMiddleware = require('../middlerwares/authMiddleware')

router.get('/information',authMiddleware.authMiddleware, userController.getInformationById)


module.exports = router