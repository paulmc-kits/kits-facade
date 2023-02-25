const express = require('express')
const router = express.Router()
const logger = require('../../lib/logger')

const staticPagesRouter = require('../static-pages')

const { viewBrowsePage } = require('../../controllers/browseController')
const { publisherRequested } = require('../../controllers/publisherController')
const { getDataFromAppLocals } = require('../../lib/common/utils')
const { getDatasetDetails } = require('../../lib/services/ckan-dataset-apis')
const { getLicenceDetails, getUpdateFrequency } = require('../../lib/ckan-constants')
const { formatDate, convertNotes, getTimePeriod } = require('../../lib/formatters')
const { feedbackUrls } = require('../../lib/constants')
const { viewContactThankYouPage, viewContactPage, submitContactPage } = require('../../controllers/contactController')

router.get('/browse', viewBrowsePage)
router.get('/publisher-requested',publisherRequested)


router.get('/dataset/detail/:datasetName',
    async (req, res, next) => {
        try {
            const userData = getDataFromAppLocals(res.locals, 'user')
            const result = await getDatasetDetails(req.params.datasetName)

            result.licence = {}
            if (result.license_id) {
                result.licence = getLicenceDetails(result.license_id)
            }

            if (result.update_frequency) {
                result.update_frequency = getUpdateFrequency(result.update_frequency)
            }

            if (result.metadata_created) {
                result.metadata_created_formatted = formatDate(result.metadata_created, "dd/MM/yyyy")
            }

            if (result.metadata_modified) {
                result.metadata_modified_formatted = formatDate(result.metadata_modified, "dd/MM/yyyy")
            }

            if (result.notes) {
                result.notes_formatted = convertNotes(result.notes)
            }

            result.time_period = getTimePeriod(result)

            logger.info(`getDatasetDetails RESULT: ${JSON.stringify(result)}`)
            res.render('dataset-details.njk', { userData, datasetDetails: result, feedbackUrls })
        } catch (error) {
            logger.error(`getDatasetDetails ERROR: ${error}`)
            next(error)
        }
    }
)

router.get('/contact-thankyou',viewContactThankYouPage)
router.get('/contact',viewContactPage)
router.post('/contact',submitContactPage)


router.all(
    [
        '/',
        '/accessibility',
        '/cookies',
        '/privacy',
        '/roadmap',
        '/terms-and-conditions',
        '/404'
    ], staticPagesRouter)

module.exports = router