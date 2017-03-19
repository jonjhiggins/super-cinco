/* eslint no-console: 0 */
const config = require('../config.json')
const nano = require('nano')('http://localhost:5984')

/**
 * Initialise the module
 * @function init
 * @returns {promise|string} resolved returns authenticated nano instance, rejected returns error string
 */
const init = function () {
  const promise = new Promise((resolve, reject) => {
    if (!config.username || !config.password) {
      reject('Missing username or password in ./config.json')
    } else {
      const promise2 = new Promise((resolve, reject) => {
        authUser()
          .then(storeCookie)
          .then(nanoInstance => {
            resolve(nanoInstance)
          })
          .catch(err => {
            reject(err)
          })
      })
      resolve(promise2)
    }
  })

  return promise
}

/**
 * Authenticate admin user
 * @function authUser
 * @returns {promise|string} resolved: headers + nano instance / rejected: error message
 */
const authUser = function () {
  const promise = new Promise((resolve, reject) => {
    nano.auth(config.username, config.password, (err, body, headers) => {
      if (err) {
        reject(err)
      } else {
        resolve({headers: headers, nanoInstance: nano})
      }
    })
  })
  return promise
}

/**
 * Persist the authentication
 * @function storeCookie
 * @param {object} headers - http headers from nano.auth in authUser
 * @param {object} nanoInstance - nano/couchDB instance
 * @returns {object} authenticated nano/couchDB instance
 */
const storeCookie = function ({headers, nanoInstance}) {
  nanoInstance = require('nano')({
    url: 'http://localhost:5984',
    cookie: headers['set-cookie']
  })
  return nanoInstance
}

module.exports = init
