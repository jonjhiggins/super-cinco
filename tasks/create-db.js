/* eslint no-console: 0 */
var config = require('../config.json')
var chalk = require('chalk')
var errorTheme = chalk.bold.red
var successTheme = chalk.bold.green
var nanoConnect = require('./nano-connect')
var Q = require('q')

/* eslint no-console: 0 */

/**
 * Initialise the module
 * @function init
 */
var init = function () {
  nanoConnect()
    .then(createDbs)
    .catch(function (err) {
      console.log(errorTheme(err))
    })
}

/**
 * Authenticate admin user
 * @function authUser
 * @param {object} err - the error, if any
 * @param {object} body - the http response body from couchdb, if no error. json parsed body, binary for non json responses
 * @param {object} headers - http headers
 * @returns {promise|string} returns the body object if resolved, or error string if rejected
 */
var authUser = function () {
  var deferred = Q.defer()
  nano.auth(config.username, config.password, function (err, body, headers) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(headers)
    }
  })
  return deferred.promise
}

/**
 * Create the CouchDB databases requried for app
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 */
var createDbs = function (nano) {
  createDb(nano, '_users').fail(function (err) {
    console.log(errorTheme(err))
  })
  createDb(nano, 'super-cinco').fail(function (err) {
    console.log(errorTheme(err))
  })
}

/**
 * Create a CouchDB database with supplied name
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 * @param {string} dbName - database name to create
 * @returns {promise|string} returns the body object if resolved, or error string if rejected
 */
var createDb = function (nano, dbName) {
  var deferred = Q.defer()
  nano.db.create(dbName, function (err, body) {
    if (err) {
      deferred.reject(err + ' (' + dbName + ')')
    } else {
      console.log(successTheme(dbName + ' database created'))
      deferred.resolve(body)
    }
  })
  return deferred.promise
}

init()
