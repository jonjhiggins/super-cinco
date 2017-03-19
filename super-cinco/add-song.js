/* eslint no-console: 0 */

/**
 * Add a song to the songs database
 * @function init
 * @param {object} nano - authenticated nano/couchDB instance
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @returns {promise} resolved/rejected string
 */
const init = function (nano, artist, song) {
  return getUuids(nano)
          .then(insertSong.bind(null, artist, song))
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
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @param {object} resolved - object containing uuids and nano instance
 * @returns {string} resolved/rejected message
 */
const insertSong = function (artist, song, resolved) {
  const nano = resolved.nano
  const uuid = resolved.uuids[0]
  const songsDb = nano.use('super-cinco-songs')
  const doc = {
    '_id': uuid,
    'artist': artist,
    'song': song
  }
  const promise = new Promise((resolve, reject) => {
    songsDb.insert(doc, (err, body) => {
      if (err) {
        reject('Could not add song: ' + err)
      } else {
        resolve('Song "' + doc.artist + ' - ' + doc.song + '" successfully added')
      }
    })
  })
  return promise
}

module.exports = init
