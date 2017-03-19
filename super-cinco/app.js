/* eslint no-console: 0 */
const addSong = require('./add-song')
const createDb = require('./create-db')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const nanoConnect = require('./nano-connect')

/**
 * Add a song to the songs database
 * @function addSong
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @returns {promise} resolved/rejected string
 */
const addSongToDb = function (artist, song) {
  return nanoConnect()
           .then(nano => {
             const promise = new Promise((resolve, reject) => {
               createDb(nano)
                 .then(msg => {
                   console.log(successTheme(msg))
                 })
                 .then(addSong.bind(null, nano, artist, song))
                 .then(msg => {
                   console.log(successTheme(msg))
                   resolve(msg)
                 })
                 .catch(function (err) {
                   reject(err)
                 })
             })
             return promise
           })
           .catch(function (err) {
             console.log(errorTheme(err))
             return err
           })
}

module.exports = {
  addSong: addSongToDb
}
