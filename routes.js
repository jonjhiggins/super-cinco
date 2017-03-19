const express = require('express')
const router = express.Router()
const path = require('path')
const app = require('./app/app')

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

router.get('/add-song', (req, res) => {
  app()
    .then(a => res.send(a))
    .catch(a => res.send(a))
})

module.exports = router
