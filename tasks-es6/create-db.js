/* eslint no-console: 0 */
const chalk = require('chalk')
const successTheme = chalk.bold.green
const nanoConnect = require('./nano-connect')
const dbsToCreate = [
  'super-cinco-songs'
]

/* eslint no-console: 0 */

/**
 * Initialise the module
 * @function init
 */
const init = function () {
  return nanoConnect()
          .then(getDbs)
          .then(({nano, body: existingDbs}) => {
            checkIfCreateDb(existingDbs)
            return nano
          })
          .then(createDbs)
          .then(msg => {
            console.log(successTheme(msg))
          })
}

/**
 * Get a list of current databases in CouchDB
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 * @returns {promise|string} resolved: authenticated nano instance and response body, rejected: error string
 */
const getDbs = function (nano) {
  const promise = new Promise((resolve, reject) => {
    nano.db.list((err, body) => {
      if (err) {
        reject(err)
      } else {
        resolve({nano, body})
      }
    })
  })
  return promise
}

/**
 * Create the CouchDB databases requried for app
 * @function checkIfCreateDb
 * @param {array} existingDbs - list of databases in CouchDB
 */
const checkIfCreateDb = function (existingDbs) {
  for (let [index, value] of dbsToCreate.entries()) {
    if (existingDbs.includes(value)) {
      console.log(index)
    }
  }
}

/**
 * Create the CouchDB databases requried for app
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 * @returns {promise|string} from createDb
 */
const createDbs = function (nano) {
  return createDb(nano, dbsToCreate[0])
}

/**
 * Create a CouchDB database with supplied name
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 * @param {string} dbName - database name to create
 * @returns {promise|string} returns the body object if resolved, or error string if rejected
 */
const createDb = function (nano, dbName) {
  const promise = new Promise((resolve, reject) => {
    nano.db.create(dbName, (err, body) => {
      if (err) {
        reject(err + ' (' + dbName + ')')
      } else {
        if (body.ok) {
          resolve(dbName + ' database created')
        } else {
          reject(dbName + ' database not created')
        }
      }
    })
  })
  return promise
}

module.exports = init
