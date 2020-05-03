const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

const likeValidator = [check('mediaId').isUUID(), check('mediaType').isString(), check('userId').isUUID()]
const { Like, Video, Course } = require('../db/db')

router.post('/likes', likeValidator, async (req, res) => {
  try {
    const { mediaId, mediaType, userId } = req.body
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    if (!userId) {
      return res.status(401).json({ error: 'Error like'})
    }

    let media = await Video.findById(mediaId)
    if (mediaType === 'course') {
      media = await Course.findById(mediaId)
    }

    if (!media) {
      return res.status(401).json({ error: 'Error fetching the media with id', mediaId })
    }

    const existingMediaLike = await Like.findOne({ mediaId, userId });
    let newLikes = media.likes;
    if (existingMediaLike) {
      await Like.findOneAndRemove({ mediaId, userId })
      newLikes -= 1
    } else {
      const like = new Like({ ip, mediaId, mediaType, userId })
      newLikes += 1
      await like.save()
    }

    media.likes = newLikes
    await media.save()

    res.json({ likes: newLikes })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

module.exports = router
