const express = require('express')
const { dashboardView } = require('../../controllers/datasetController')
const logger = require('../../lib/logger')
const router = express.Router()
const auth = require('../../middleware/auth')


router.use((req,res,next) => {
    logger.info("Auth router middleware")
    next()
})

router.get('/dashboard', auth.authenticate, dashboardView)

module.exports= router