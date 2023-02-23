const express = require('express')
const logger = require('../lib/logger')

const { feedbackUrls } = require('../lib/constants')
const { getDataFromAppLocals } = require('../lib/common/utils')

const router = express.Router()

router.get('*', (req, res, next) => {
    logger.info(`Static page: ${req.url}`)

    const userData = getDataFromAppLocals(res.locals, 'user')
    const staticPageDataRender = { userData, feedbackUrls }

    switch (req.url) {
        case '/':
            res.render('static-pages/homepage.njk', { ...staticPageDataRender })
            break
        case '/accessibility':
            res.render('static-pages/accessibility.njk', { ...staticPageDataRender })
            break
        case '/cookies':
            res.render('static-pages/cookies.njk', { ...staticPageDataRender })
            break
        case '/privacy':
            res.render('static-pages/privacy.njk', { ...staticPageDataRender })
            break
        case '/roadmap':
            res.render('static-pages/roadmap.njk', { ...staticPageDataRender })
            break
        case '/terms-and-conditions':
            res.render('static-pages/terms-and-conditions.njk', { ...staticPageDataRender })
            break
        case '/404':
            res.render('static-pages/404.njk', { ...staticPageDataRender })
            break
        default:
            next()
    }

})

module.exports = router