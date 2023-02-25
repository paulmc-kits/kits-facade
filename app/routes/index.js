const express = require('express')

const { login, viewLoginPage, logout } = require('../controllers/authController')
const { requestPublisherAccount } = require('../controllers/publisherController')
const protectedRoutes = require('./protectedRoutes/auth')
const notProtectedRoutes = require('./nonProtectedRoutes/index')
const  adminViews  = require('./protectedRoutes/admin/manage-publisher')

const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.get('/login', viewLoginPage)
router.post('/login', login)
router.get('/user/logged_out', logout)
router.post('/register', requestPublisherAccount)

router.use('/admin', adminViews)

router.use(authenticate)
router.use(notProtectedRoutes)
router.use(protectedRoutes)

module.exports = router