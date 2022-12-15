const express = require('express')
const logger = require('../lib/logger')

const { feedbackUrls } = require('../lib/constants')

const router = express.Router()

router.get('*', (req, res, next) => {
    logger.info(`Static page: ${req.url}`)
    
    switch (req.url) {
        case '/':
            res.render('static-pages/homepage.njk',{feedbackUrls})
            break
        case '/accessibility':
            res.render('static-pages/accessibility.njk',{feedbackUrls})
            break
        case '/cookies':
            res.render('static-pages/cookies.njk',{feedbackUrls})
            break
        case '/privacy':
            res.render('static-pages/privacy.njk',{feedbackUrls})
            break
        case '/roadmap':
            res.render('static-pages/roadmap.njk',{feedbackUrls})
            break
        case '/404':
                res.render('static-pages/404.njk',{feedbackUrls})
                break
        default:
            next()
    } 

})

module.exports = router