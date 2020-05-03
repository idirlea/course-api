const config = require("dotenv").config()
const multer = require("multer")
const crypto = require("crypto")
const path = require("path")

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

// const GridFsStorage = require("multer-gridfs-storage");

// // Create storage engine
// const storage = new GridFsStorage({
//   url: config.parsed.MONGODB_URL,
//   options: { useUnifiedTopology: true },
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err)
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname)
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads',
//         }
//         resolve(fileInfo)
//       })
//     })
//   },
// })

const upload = multer(multerOptions)

module.exports = upload;
