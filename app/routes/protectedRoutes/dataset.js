const express = require('express')
const { createAndUpdateDatasetPageView, createAndUpdatePackage,deletePackage } = require('../../controllers/datasetController')
const logger = require('../../lib/logger')

const auth = require('../../middleware/auth')

const router = express.Router()


router.use(auth.authenticate)

router.get('/new', createAndUpdateDatasetPageView)
router.post('/new', createAndUpdatePackage)

router.get('/edit/:datasetId', createAndUpdateDatasetPageView)
router.post('/edit/:datasetId', createAndUpdatePackage)

router.post('/delete', deletePackage)

module.exports = router
