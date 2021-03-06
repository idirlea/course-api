const { v4: uuidv4 } = require('uuid')
const jimp = require('jimp')

const createImage = async (req, file, {fieldName, size}) => {
  const extension = file.mimetype.split('/')[1]
  req.body[fieldName] = `${uuidv4()}.${extension}`

  const originalSize = await jimp.read(file.buffer)
  await originalSize.resize(size.big, jimp.AUTO).quality(90)
  await originalSize.write(`./public/uploads/original_${req.body[fieldName]}`)

  const videoThumbnail = await jimp.read(file.buffer)
  await videoThumbnail.resize(size.thumb, jimp.AUTO).quality(90)
  await videoThumbnail.write(`./public/uploads/${req.body[fieldName]}`)
}

module.exports = async (req, res, next) => {
  if (!req.file && !req.files) {
    next()
    return
  }

  if (req.file) {
    await createImage(req, req.file, {fieldName: 'videoThumbnail', size: { big: 1200, thumb: 200 }})
  }

  if (req.files && req.files) {
    const thumbnail = req.files['thumbnail'] && req.files['thumbnail'][0]
    const poster = req.files['poster'] && req.files['poster'][0]

    thumbnail && await createImage(req, thumbnail, {fieldName: 'thumbnail', size: { big: 1200, thumb: 200 }})
    poster && await createImage(req, poster, {fieldName: 'poster', size: { big: 1200, thumb: 200 }})
  }

  next()
}
