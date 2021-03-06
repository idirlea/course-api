const multer = require("multer")

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')

    if (isPhoto) {
      next(null, true)
    } else {
      next({message: 'That file type is not allowed'}, false)
    }
  }
}

const upload = multer(multerOptions)

module.exports = upload;
