/* eslint no-console: 0 */
const nanoConnect = require('./nano-connect')
const dbsRequired = [
  'super-cinco-songs'
]

/* eslint no-console: 0 */

/**
 * Initialise the module
 * @function init
 * @returns {string} message detailing which databases created
 */
const init = function () {
  return nanoConnect()
          .then(getDbs)
          .then(({nano, body: existingDbs}) => {
            const dbsToCreate = checkIfCreateDb(existingDbs)
            return {nano: nano, dbsToCreate: dbsToCreate}
          })
          .then(createDbs)
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
 * Check which DBs already exist and remove them from dbsRequired
 * @function checkIfCreateDb
 * @param {array} existingDbs - list of databases in CouchDB
 * @returns {array} filtered list of DBs
 */
const checkIfCreateDb = function (existingDbs) {
  return dbsRequired.filter(value => !existingDbs.includes(value))
}

/**
 * Create the CouchDB databases requried for app
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 * @param {array} dbsToCreate - which databases need to be created
 * @returns {promise|string} from createDb
 */
const createDbs = function ({nano, dbsToCreate}) {
  const promises = []
  if (dbsToCreate.length) {
    for (const db of dbsToCreate) {
      promises.push(createDb(nano, db))
    }
    return Promise.all(promises)
  } else {
    return 'All databases already exist'
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
