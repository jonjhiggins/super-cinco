/* eslint no-console: 0 */
const addSong = require('./add-song')
// const createDb = require('./create-db')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const monk = require('monk')

/**
 * Prepare DB connection
 * @function prepareDb
 * @param {string} username db username
 * @param {string} password db password
 * @param {string} url db url
 * @param {object} options db connection options
 * @returns {object} monk/mongodb DB object
 */
const prepareDb = function (username, password, url, options) {
  console.log(username, password, url)
  const dbUrl = username + ':' + encodeURIComponent(password) + '@' + url
  const db = monk(dbUrl)
  return db
}

/**
 * Add a song to the songs database
 * @function addSong
 * @param {object} dbConfig object containing database settings
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @param {boolean} verbose should it log out errors etc
 * @returns {promise} resolved/rejected string
 */
const addSongToDb = function (dbConfig, artist, song, verbose = false) {
  return prepareDb(dbConfig['DB_USER'], dbConfig['DB_PASS'], dbConfig['DB_HOST'], dbConfig.options)
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

module.exports = {
  addSong: addSongToDb
}
