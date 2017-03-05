/* eslint no-console: 0 */

const nano = require('./nano-connect')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green
const Q = require('q')

/**
 * Add a song to the songs database
 * @function init
 */
const init = function () {
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
const getUuids = function (nano) {
  const deferred = Q.defer()
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
const insertSong = function (resolved) {
  const deferred = Q.defer()
  const nano = resolved.nano
  const uuid = resolved.uuids[0]
  const songsDb = nano.use('super-cinco-songs')
  const doc = {
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

module.exports = init
