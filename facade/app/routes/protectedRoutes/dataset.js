const express = require('express')
const { viewCreateDatasetPage, createPackage } = require('../../controllers/datasetController')
const logger = require('../../lib/logger')

const auth = require('../../middleware/auth')

const router = express.Router()


router.use(auth.authenticate)

router.get('/new', viewCreateDatasetPage)
router.post('/new', createPackage)


module.exports = router
