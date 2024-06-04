const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const history = require('connect-history-api-fallback')
const hateoasLinks = require('./hateoasLinks')

require('./db/DBhandler').connectToDB()

// ==================== URI ====================

const port = process.env.PORT || 3000
const baseUrl = `http://localhost:${port}`
const backendUrl = `${baseUrl}/api/v1`

hateoasLinks.setBaseUrl(baseUrl)
hateoasLinks.setBackendUrl(backendUrl)

// ==================== EXPRESS ====================

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev')) // HTTP request logger

// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors())
app.use(cors())

// HTTP method override, inspired by online examples and ChatGPT
app.use((req, _, next) => {
  if (req.headers['x-http-method-override']) {
    req.method = req.headers['x-http-method-override'].toUpperCase()
  }
  next()
})

app.get('/api/v1', function (req, res) {
  res.json({ message: 'Welcome to your DIT342 backend ExpressJS project!' })
})

// ==================== ROUTES ====================

require('./routers').init(app) // needs to be called before routes are required

// sets up routes
require('./routes/login')
require('./routes/course')
require('./routes/user')
require('./routes/post')
require('./routes/attendance')
require('./routes/review')

// ==================== FRONTEND ====================

// Support Vuejs HTML 5 history mode
app.use(history())

// Serve static assets
const root = path.normalize(__dirname + '/..')
const client = path.join(root, 'client', 'dist')
app.use(express.static(client))

// ==================== ERROR HANDLING ====================

app.use('/api/v1/*', function (req, res) {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env')
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack)
  var err_res = {
    message: err.message,
    error: {}
  }
  if (env === 'development') {
    // Return sensitive stack trace only in dev mode
    err_res['error'] = err.stack
  }
  res.status(err.status || 500)
  res.json(err_res)
})

// ==================== START ====================

app.listen(port, function (err) {
  if (err) throw err
  console.log(`Express server listening on port ${port}, in ${app.get('env')} mode`)
  console.log(`Backend: ${backendUrl}}`)
  console.log(`Frontend (production): ${baseUrl}/`)
})
