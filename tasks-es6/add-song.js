/* eslint no-console: 0 */

var nano = require('./nano-connect')
var chalk = require('chalk')
var errorTheme = chalk.bold.red
var successTheme = chalk.bold.green
var Q = require('q')

/**
 * Add a song to the songs database
 * @function init
 */
var init = function () {
  nano()
    .then(getUuids)
    .then(insertSong)
    .then(function (msg) {
      if (msg) {
        console.log(successTheme(msg))
      } else {
        console.log(errorTheme('Could not add song'))
      }
    })
  .catch(function (err) {
    console.log(errorTheme(err))
  })
}

/**
 * Get Unique IDs for adding documents to a couchdb database
 * @function getUuids
 * @param {object} nano - nano/couchDB instance
 * @returns {object|string} resolved: object containing uuids and nano instance / rejected: error message
 */
var getUuids = function (nano) {
  var deferred = Q.defer()
  nano.uuids(1, function (err, body) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve({uuids: body.uuids, nano: nano})
    }
  })
  return deferred.promise
}

/**
 * Insert a song in to the songs database
 * @function insertSong
 * @param {object} resolved - object containing uuids and nano instance
 * @returns {string} resolved/rejected message
 */
var insertSong = function (resolved) {
  var deferred = Q.defer()
  var nano = resolved.nano
  var uuid = resolved.uuids[0]
  var songsDb = nano.use('super-cinco-songs')
  var doc = {
    '_id': uuid,
    'artist': 'Test Artist',
    'song': 'Test Song'
  }
  songsDb.insert(doc, function (err, body) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve('"' + doc.artist + ' - ' + doc.song + '" successfully added')
    }
  })
  return deferred.promise
}

init()
