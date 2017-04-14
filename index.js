const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')
const config = require('dotenv').config()
const buildConfig = require('./lib/build-config')
const dbType = process.env.NODE_ENV.toUpperCase()

app.superCinco = {
  config: buildConfig(config.parsed, dbType)
}

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))

// Use routing in routes.js
app.use('/', routes)

// Serve static assets
app.use('/bundle', express.static('bundle'))

// Start server
app.listen(3000, () => {
  console.log('Listenting on port 3000')
})
