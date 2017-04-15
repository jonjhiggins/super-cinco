const superCinco = require('../super-cinco/app')
const config = require('dotenv').config({path: '../.env'})
const buildConfig = require('../lib/build-config')
console.log(config.parsed)
const appConfig = buildConfig(config.parsed, 'DEV')

module.exports.addSong = (event, context, callback) => {
  // const artist1 = req.body['artist-1']
  // const song1 = req.body['song-1']
  //
  const artist1 = 'artist-2'
  const song1 = 'song-2'
  superCinco.addSong(appConfig, artist1, song1)
    .then(msg => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          msg: msg
        })
      }

      callback(null, response)
    })
    .catch(err => {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          msg: err.name + ': ' + err.message
        })
      }

      callback(null, response)
    })
}
