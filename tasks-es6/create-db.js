/* eslint no-console: 0 */
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const nanoConnect = require('./nano-connect')
const Q = require('q')
const dbs = [
  'super-cinco-songs'
]

/* eslint no-console: 0 */

/**
 * Initialise the module
 * @function init
 */
const init = function () {
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
const createDbs = function (nano) {
  for (let i = 0; i < dbs.length; i++) {
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
const createDb = function (nano, dbName) {
  const deferred = Q.defer()
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

module.exports = init
