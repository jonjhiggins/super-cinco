const express = require('express')
const router = express.Router()
const path = require('path')
const superCinco = require('./super-cinco/app')
const chalk = require('chalk')
const errorTheme = chalk.bold.red

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

router.post('/', (req, res) => {
  const artist1 = req.body['artist-1']
  const song1 = req.body['song-1']
  superCinco.addSong(artist1, song1)
    .then(a => {
      res.sendFile(path.join(__dirname, '/index.html'))
    })
    .catch(err => {
      console.log(errorTheme(err))
      res.sendFile(path.join(__dirname, '/index.html'))
    })
})

module.exports = router
