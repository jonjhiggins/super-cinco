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
 * @returns {object} monk/mongodb DB object
 */
const prepareDb = function (username, password) {
  const url = username + ':' + encodeURIComponent(password) + '@localhost:27017/super-cinco'
  const db = monk(url)
  return db
}

/**
 * Add a song to the songs database
 * @function addSong
 * @param {object} config object containing username and password
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @param {boolean} verbose should it log out errors etc
 * @returns {promise} resolved/rejected string
 */
const addSongToDb = function (config, artist, song, verbose = false) {
  return prepareDb(config.username, config.password)
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
