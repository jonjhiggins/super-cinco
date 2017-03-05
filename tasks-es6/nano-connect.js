/* eslint no-console: 0 */
const config = require('../config.json')
const nano = require('nano')('http://localhost:5984')
const Q = require('q')

/**
 * Initialise the module
 * @function init
 * @returns {promise|string} resolved returns authenticated nano instance, rejected returns error string
 */
const init = function () {
  const p = new Promise((resolve, reject) => {
    if (!config.username || !config.password) {
      reject('Missing username or password in ./config.json')
    } else {
      const p2 = new Promise((resolve, reject) => {
        authUser()
          .then(storeCookie)
          .then(function (nanoInstance) {
            resolve(nanoInstance)
          })
          .catch(function (err) {
            reject(err)
          })
      })
      resolve(p2)
    }
  })

  return p
}

/**
 * Authenticate admin user
 * @function authUser
 * @returns {promise|string} resolved: headers + nano instance / rejected: error message
 */
const authUser = function () {
  const deferred = Q.defer()
  nano.auth(config.username, config.password, function (err, body, headers) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve({headers: headers, nanoInstance: nano})
    }
  })
  return deferred.promise
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
