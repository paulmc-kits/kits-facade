const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const nunjucks = require('nunjucks')
const path = require('node:path')
const pinoLogger = require('express-pino-logger')
const uuid = require('uuid')

const routes = require('./routes')

const logger = require('./lib/logger')
const auth = require('./middleware/auth')
const sequelize = require('./lib/database')


const app = express()

app.use(
  pinoLogger({
    logger,
    autoLogging: false,
    genReqId: () => uuid.v4()
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Helmet
app.use(
  helmet.frameguard({
    action: "deny"
  })
)
app.use(helmet.hidePoweredBy());

// passport auth
app.use(auth.initialize())

// Deal with static files in the public folder
app.use('/assets', express.static('public'))
app.use('/favicon.ico', express.static('public/images/favicon.ico'))
app.use(
  '/assets/govuk/all.js',
  express.static(path.join('node_modules', 'govuk-frontend', 'govuk', 'all.js'))
)

app.use(
  '/assets/accessible-autocomplete',
  express.static(path.join('node_modules', 'accessible-autocomplete', 'dist'))
)

app.use(
  '/assets/csv-writer.js',
  express.static(path.join('lib','csv-writer.js'))
)

const viewPaths = [
  path.join('node_modules', 'govuk-frontend'),
  path.join('views')
]

nunjucks.configure(viewPaths, {
  autoescape: true,
  express: app
})

// Routes
app.use('/', routes)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).redirect('/404')
  logger.error(new Error('404'))
  next()
})

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Log the error object
  logger.error(new Error(err.message))

  res.status(err.status || 500)
  res.render('static-pages/500.njk', { requestId: req.id ? req.id : "" })
})

module.exports = app