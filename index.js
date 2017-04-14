const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')
const config = require('dotenv').config()
const dbType = process.env.NODE_ENV.toUpperCase()

app.superCinco = {
  config: {
    DB_HOST: config.parsed['DB_' + dbType + '_HOST'],
    DB_USER: config.parsed['DB_' + dbType + '_USER'],
    DB_PASS: config.parsed['DB_' + dbType + '_PASS'],
    DB_SSL: config.parsed['DB_' + dbType + '_SSL'] === 'true',
    DB_AUTH_SOURCE: config.parsed['DB_' + dbType + '_AUTH_SOURCE']
  }
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
