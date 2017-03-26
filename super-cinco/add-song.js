/* eslint no-console: 0 */

/**
 * Add a song to the songs database
 * @function init
 * @param {object} db - authenticated database instance
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @returns {promise} resolved/rejected string
 */
const init = function (db, artist, song) {
  return insertSong(db, artist, song)
}

/**
 * Insert a song in to the songs database
 * @function insertSong
 * @param {object} db - authenticated database instance
 * @param {string} artist artist of song to add
 * @param {string} song title of song to add
 * @returns {string} resolved/rejected message
 */
const insertSong = function (db, artist, song) {
  const songsCollection = db.get('super-cinco-songs')
  const doc = {
    'artist': artist,
    'song': song
  }
  const promise = new Promise((resolve, reject) => {
    songsCollection.insert(doc)
      .then(docs => {
        resolve('Song "' + docs.artist + ' - ' + docs.song + '" successfully added')
      })
      .catch(err => {
        reject('Could not add song: ' + err)
      })
      .then(() => db.close())
  })
  return promise
}

module.exports = init
