/* eslint no-console: 0 */
const chalk = require('chalk')
const successTheme = chalk.bold.green
const nanoConnect = require('./nano-connect')
const dbs = [
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
          .then(response => {
            console.log(response.body)
            // If a database in the reponse exists in "dbs" array
            // remove it - it's already been created
            return response.nano
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
 * @function createDb
 * @param {object} nano - nano/couchDB instance to create database on
 */
const createDbs = function (nano) {
  const promises = []
  for (let i = 0; i < dbs.length; i++) {
    promises[i] = new Promise((resolve, reject) => {
      createDb(nano, dbs[i])
        .then(msg => {
          resolve(msg)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  return Promise.all(promises)
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
