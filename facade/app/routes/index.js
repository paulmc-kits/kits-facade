const express = require('express')
const router = express.Router()

const logger = require('../lib/logger')
const { getDatasetDetails } = require('../lib/ckan-api')
const { getLicenceDetails, getUpdateFrequency } = require('../lib/ckan-constants')
const { convertNotes, formatDate, getTimePeriod  } = require('../lib/formatters')

const staticPagesRouter = require('./static-pages')

router.get('/dataset/:datasetName',
    async (req, res, next) => {
        try {
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
            res.render('dataset-details.njk', { datasetDetails: result })
        } catch (error) {
            logger.error(`getDatasetDetails ERROR: ${error}`)
            next(error)
        }
    }
)

router.all(
    [
        '/',
        '/accessibility',
        '/cookies',
        '/privacy',
        '/roadmap'
    ], staticPagesRouter)

module.exports = router