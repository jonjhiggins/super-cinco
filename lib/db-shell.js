// Build up connection string for mongo shell command
const config = require('dotenv').config()
const buildConfig = require('./build-config')
const dbType = process.env.NODE_ENV.toUpperCase()

const appConfig = buildConfig(config.parsed, dbType)
const db = `${appConfig.DB_HOST}`
const authSource = appConfig.DB_AUTH_SOURCE ? `--authenticationDatabase  ${appConfig.DB_AUTH_SOURCE}` : ''
const ssl = appConfig.DB_SSL ? '--ssl ' : ''
const username = `--username ${appConfig.DB_USER}`
const password = `--password ${appConfig.DB_PASS}`
const cmd = `${db} ${authSource} ${ssl} ${username} ${password}`

process.stdout.write(cmd)
