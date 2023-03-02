const express = require('express')
const router = express.Router()

const { dashboardView } = require('../../controllers/datasetController')
const {protectedMiddleWare} = require('../../middleware/protectedMiddleware')
const dataset = require('../protectedRoutes/dataset')

router.use('/dataset',protectedMiddleWare, dataset)
router.get('/user/dashboard',protectedMiddleWare, dashboardView)

module.exports = router