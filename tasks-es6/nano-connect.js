/* eslint no-console: 0 */
var config = require('../config.json')
var nano = require('nano')('http://localhost:5984')
var Q = require('q')

/**
 * Initialise the module
 * @function init
 * @returns {promise|string} resolved returns authenticated nano instance, rejected returns error string
 */
var init = function () {
  var deferred = Q.defer()
  // Authorise admin user to connect to CouchDB
  if (!config.username || !config.password) {
    deferred.reject('Missing username or password in ./config.json')
  } else {
    authUser()
      .then(storeCookie)
      .then(function (nano) {
        deferred.resolve(nano)
      })
      .catch(function (err) {
        deferred.reject(err)
      })
  }
  return deferred.promise
}

/**
 * Authenticate admin user
 * @function authUser
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
 * Persist the authentication
 * @function storeCookie
 * @param {object} headers - http headers from nano.auth in authUser
 * @returns {object} authenticated nano/couchDB instance
 */
var storeCookie = function (headers) {
  nano = require('nano')({
    url: 'http://localhost:5984',
    cookie: headers['set-cookie']
  })
  return nano
}

module.exports = init
