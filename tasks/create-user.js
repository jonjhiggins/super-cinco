var config = require('../config.json')
var chalk = require('chalk')
var errorTheme = chalk.bold.red
var successTheme = chalk.bold.green
var nano = require('nano')('http://localhost:5984')
var Q = require('q')

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
    authUser()
      .then(createDb)
      //return nano.db.create('super-cinco', createDb.bind(null, 'super-cinco')))
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
  var deferred = Q.defer()
  nano.auth(config.username, config.password, function (err, body) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      deferred.resolve(body)
    }
  })
  return deferred.promise
}

/**
 * Create the CouchDB database for app
 * @function createDb
 * @param {object} err - the error, if any
 * @param {object} body - the http response body from couchdb, if no error. json parsed body, binary for non json responses
 * @param {object} headers
 * @returns {function}
 */
// var authUser = function (err, body, headers) {
//
//   nano = require('nano')({
//     url: 'http://localhost:5984',
//     cookie: headers['set-cookie']
//   })
//
//
// }

/**
 * Create the CouchDB database for app
 * @function createDb
 */
var createDb = function () {
  var deferred = Q.defer()
  nano.db.create('_users', function (err, body) {
    if (err) {
      deferred.reject(new Error(err))
    } else {
      deferred.resolve(body)
    }
    return deferred.promise
  })
}

init()
