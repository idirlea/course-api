const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

const viewValidator = [check('mediaId').isString(), check('mediaType').isString()]
const { View, Video, Course } = require('../db/db')

router.post('/views', viewValidator, async (req, res) => {
  try {

    const { mediaId, mediaType } = req.body
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    let media = await Video.findById(mediaId)
    if (mediaType === 'course') {
      media = await Course.findById(mediaId)
    }

    if (!media) {
      return res.status(401).json({ error: 'Error fetching the media with id', mediaId })
    }

    const view = new View({ ip, mediaId, mediaType })
    await view.save()

    const newViews = media.views + 1
    media.views = newViews

    await media.save()

    res.json({ views: newViews })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

module.exports = router