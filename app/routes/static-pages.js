const express = require('express')
const router = express.Router()

const logger = require('../lib/logger')

router.get('*', (req, res, next) => {
    logger.info(`Static page: ${req.url}`)

    switch (req.url) {
        case '/':
            res.render('static-pages/homepage.njk')
            break
        case '/accessibility':
            res.render('static-pages/accessibility.njk')
            break
        case '/cookies':
            res.render('static-pages/cookies.njk')
            break
        case '/privacy':
            res.render('static-pages/privacy.njk')
            break
        case '/roadmap':
            res.render('static-pages/roadmap.njk')
            break
        default:
            next()
    } 

})

module.exports = router