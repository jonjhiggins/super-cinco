/* eslint no-console: 0 */

const nanoConnect = require('./nano-connect')
const chalk = require('chalk')
const errorTheme = chalk.bold.red
const successTheme = chalk.bold.green

/**
 * Add a song to the songs database
 * @function init
 */
const init = function () {
  return nanoConnect()
          .then(getUuids)
          .then(insertSong)
          .then(function (msg) {
            if (msg) {
              console.log(successTheme(msg))
            } else {
              console.log(errorTheme('Could not add song'))
            }
          })
}

/**
 * Get Unique IDs for adding documents to a couchdb database
 * @function getUuids
 * @param {object} nano - nano/couchDB instance
 * @returns {object|string} resolved: object containing uuids and nano instance / rejected: error message
 */
const getUuids = function (nano) {
  const promise = new Promise((resolve, reject) => {
    nano.uuids(1, (err, body) => {
      if (err) {
        reject(err)
      } else {
        resolve({uuids: body.uuids, nano: nano})
      }
    })
  })
  return promise
}

/**
 * Insert a song in to the songs database
 * @function insertSong
 * @param {object} resolved - object containing uuids and nano instance
 * @returns {string} resolved/rejected message
 */
const insertSong = function (resolved) {
  const nano = resolved.nano
  const uuid = resolved.uuids[0]
  const songsDb = nano.use('super-cinco-songs')
  const doc = {
    '_id': uuid,
    'artist': 'Test Artist',
    'song': 'Test Song'
  }
  const promise = new Promise((resolve, reject) => {
    songsDb.insert(doc, (err, body) => {
      if (err) {
        reject(err)
      } else {
        resolve('"' + doc.artist + ' - ' + doc.song + '" successfully added')
      }
    })
  })
  return promise
}

module.exports = init
