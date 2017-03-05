/* eslint no-console: 0 */
var config = require('../config.json')
var chalk = require('chalk')
var errorTheme = chalk.bold.red
var successTheme = chalk.bold.green
var nanoConnect = require('./nano-connect')
var Q = require('q')
var dbs = [
  '_users',
  'super-cinco-songs'
]

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
 * Create the CouchDB databases requried for app
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 */
var createDbs = function (nano) {
  for (var i = 0; i < dbs.length; i++) {
    createDb(nano, dbs[i])
      .then(function (msg) {
        console.log(successTheme(msg))
      })
      .fail(function (err) {
        console.log(errorTheme(err))
      })
  }
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
      if (body.ok) {
        deferred.resolve(dbName + ' database created')
      } else {
        deferred.reject(dbName + ' database not created')
      }
    }
  })
  return deferred.promise
}

init()
