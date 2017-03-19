/* eslint no-console: 0 */
const addSong = require('./add-song')
const createDb = require('./create-db')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const nanoConnect = require('./nano-connect')

/**
 * Add a song to the songs database
 * @returns {string} resolved/rejected message
 */
module.exports = function () {
  return nanoConnect()
          .then(createDb)
          .then(msg => {
            console.log(successTheme(msg))
          })
          .then(addSong)
          .then(msg => {
            console.log(successTheme(msg))
            return msg
          })
          .catch(function (err) {
            console.log(errorTheme(err))
            return err
          })
}
