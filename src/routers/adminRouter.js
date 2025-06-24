const adminController = require("../controllers/adminController")
const router = require('express').Router()
const authMiddleware = require('../middlerwares/authMiddleware')


router.delete('/users/:id',authMiddleware.isAmin, adminController.deleteUser)
router.post('/users/:id/restore',adminController.restoreUser)


module.exports = router