/* eslint no-console: 0 */
const addSong = require('./add-song')
// const createDb = require('./create-db')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const monk = require('monk')
const db = monk('localhost:27017/super-cinco')

/**
 * Add a song to the songs database
 * @function addSong
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @param {boolean} verbose should it log out errors etc
 * @returns {promise} resolved/rejected string
 */
const addSongToDb = function (artist, song, verbose = false) {
  const promise = new Promise((resolve, reject) => {
    addSong(db, artist, song)
      .then(msg => {
        if (verbose) {
          console.log(successTheme(msg))
        }
        resolve(msg)
      })
      .catch(function (err) {
        if (verbose) {
          console.log(errorTheme(err))
        }
        reject(err)
      })
  })
  return promise
}

module.exports = {
  addSong: addSongToDb
}
