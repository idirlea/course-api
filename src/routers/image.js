const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router();

const staticBasePath = './public/uploads'

router.get('/image/:filename', (req, res) => {
  let fileLoc = path.resolve(staticBasePath)
  fileLoc = path.join(fileLoc, `original_${req.params.filename}`)

  const stream = fs.createReadStream(fileLoc)

  stream.on('error', function(error) {
    res.writeHead(404, 'Not Found')
    res.end()
  })

  stream.pipe(res)
})

router.get('/image/thumb/:filename', (req, res) => {
  let fileLoc = path.resolve(staticBasePath)
  fileLoc = path.join(fileLoc, req.params.filename)

  const stream = fs.createReadStream(fileLoc)

  stream.on('error', function(error) {
    res.writeHead(404, 'Not Found')
    res.end()
  })

  stream.pipe(res)
})

module.exports = router;
