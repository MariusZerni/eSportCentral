const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = require('./router')
const { dbURI, port } = require('./config/environment')
const path = require('path')
const dist = path.join(__dirname, 'dist')
mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  
  err => {
    if (err) console.log(err)
    else console.log('Mongoose connected to events-db!')
  }
)


const expressServer = express()

expressServer.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

expressServer.use(bodyParser.json())


expressServer.use((req, res, next) => {
  console.log(`Incoming ${req.method} to ${req.url}`)
  next()
})

expressServer.use('/api', router)

expressServer.use('/', express.static(dist))

expressServer.get('*', function(req, res) {
  res.sendFile(path.join(dist, 'index.html'))
})

expressServer.listen(port)
