var config = require('../config.json')
var chalk = require('chalk')
var errorTheme = chalk.bold.red
var successTheme = chalk.bold.green
var nano = require('nano')('http://localhost:5984')

/**
 * Initialise the module
 * @function init
 */
var init = function () {
  // Authoise admin user to create DB
  nano.auth(config.username, config.password, authUser)
}

/**
 * Create the CouchDB database for app
 * @function createDb
 * @param {object} err - the error, if any
 * @param {object} body - the http response body from couchdb, if no error. json parsed body, binary for non json responses
 * @param {object} headers
 * @returns {function}
 */
var authUser = function (err, body, headers) {
  if (err) {
    console.log(errorTheme(err))
  }
  nano = require('nano')({
    url: 'http://localhost:5984',
    cookie: headers['set-cookie']
  })
  return nano.db.create('super-cinco', createDb)
}

/**
 * Create the CouchDB database for app
 * @function createDb
 * @param {object} err - the error, if any
 * @param {object} body - the http response body from couchdb, if no error. json parsed body, binary for non json responses
 */
var createDb = function (err, body) {
  if (err) {
    console.log(errorTheme(err))
  } else {
    console.log(successTheme('super-cinco database created'))
  }
}

init()
