const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const jimp = require('jimp')

module.exports = async (req, res, next) => {
  if (!req.file) {
    next()
    return
  }

  const extension = req.file.mimetype.split('/')[1]
  req.body.videoThumbnail = `${uuidv4()}.${extension}`


  const originalSize = await jimp.read(req.file.buffer)
  await originalSize.resize(1200, jimp.AUTO).quality(90)
  await originalSize.write(`./public/uploads/original_${req.body.videoThumbnail}`)

  const videoThumbnail = await jimp.read(req.file.buffer)
  await videoThumbnail.resize(200, jimp.AUTO).quality(90)
  await videoThumbnail.write(`./public/uploads/${req.body.videoThumbnail}`)

  next()
}
