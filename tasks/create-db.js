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
  if (!config.username || !config.password) {
    console.log(errorTheme('Missing username or password in ./config.json'))
    return
  } else {
    nano.auth(config.username, config.password, authUser)
  }
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
    return
  }
  nano = require('nano')({
    url: 'http://localhost:5984',
    cookie: headers['set-cookie']
  })

  nano.db.create('_users', createDb.bind(null, '_users'))
  return nano.db.create('super-cinco', createDb.bind(null, 'super-cinco'))
}

/**
 * Create the CouchDB database for app
 * @function createDb
 * @param {string} name - db name
 * @param {object} err - the error, if any
 * @param {object} body - the http response body from couchdb, if no error. json parsed body, binary for non json responses
 */
var createDb = function (name, err, body) {
  if (err) {
    console.log(errorTheme(name + ': ' + err))
  } else {
    console.log(successTheme(name + ' database created'))
  }
}

init()
