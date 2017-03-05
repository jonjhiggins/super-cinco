/* eslint no-console: 0 */
const addSong = require('./add-song')
const createDb = require('./create-db')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const nanoConnect = require('./nano-connect')

nanoConnect()
  .then(createDb)
  .then(addSong)
  .catch(function (err) {
    console.log(errorTheme(err))
  })
