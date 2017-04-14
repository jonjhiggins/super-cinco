/* eslint no-console: 0 */
const addSong = require('./add-song')
// const createDb = require('./create-db')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const monk = require('monk')

/**
 * Add a song to the songs database
 * @function addSong
 * @param {object} config object containing database settings
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @param {boolean} verbose should it log out errors etc
 * @returns {promise} resolved/rejected string
 */
const addSongToDb = function (config, artist, song, verbose = false) {

  const dbConfig = {
    username: config['DB_USER'],
    password: config['DB_PASS'],
    host: config['DB_HOST'],
    options: {
      ssl: config['DB_SSL'],
      authSource: config['DB_AUTH_SOURCE']
    }
  }

  return prepareDb(dbConfig)
          .then(addSong.bind(null, artist, song))
          .then(msg => {
            if (verbose) {
              console.log(successTheme(msg))
            }
            return msg
          })
          .catch(function (err) {
            if (verbose) {
              console.log(errorTheme(err))
            }
            throw err
          })
}

/**
 * Prepare DB connection
 * @function prepareDb
 * @param {object} dbConfig object containing db details
 * @param {string} dbConfig.username db username
 * @param {string} dbConfig.password db password
 * @param {string} dbConfig.host db host url
 * @param {object} dbConfig.options db connection options
 * @param {boolean} dbConfig.options.ssl db ssl on or off
 * @param {string} dbConfig.options.authSource db to authenticate against
 * @returns {object} monk/mongodb DB object
 */
const prepareDb = function ({username, password, host, options}) {
  const dbUrl = username + ':' + encodeURIComponent(password) + '@' + host
  const db = monk(dbUrl, options)
  return db
}

module.exports = {
  addSong: addSongToDb
}
