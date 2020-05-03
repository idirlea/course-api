const express = require('express');
const fs = require('fs')
const path = require('path')
const router = express.Router()

const { Video } = require('../db/db')

const auth = require('../middleware/auth');
const resize = require('../middleware/resize')

const upload = require('../middleware/upload');
const staticBasePath = './public/uploads'

const { check, query } = require('express-validator');
const videoSanitaizer = [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .isString(),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .isString(),
  check('category')
    .exists({ checkNull: true, checkFalsy: true })
    .isString(),
  check('streamSource')
    .exists({ checkNull: true, checkFalsy: true })
    .isString(),
  check('videoUrl').isString(),
  check('isFree').isBoolean(),
];

const getVideoSanitize = [query('id').isUUID(), query('isFree').isBoolean()];

router.get('/videos', getVideoSanitize, async (req, res) => {
  try {
    const { id, ...rest } = req.query || {};

    const queryById = id ? { _id: id } : {};

    const query = Object.keys(req.query).length
      ? { ...queryById, ...(rest || {}) }
      : {};

    const videos = await Video.find(query);

    if (!videos) {
      return res.status(401).json({ error: 'Fetching videos failed!' });
    }

    res.json([...videos]);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/videos', [auth, ...videoSanitaizer, upload.single('videoThumbnail'), resize], async (req, res) => {
  try {
    const { _id, ...rest } = req.body
    const video = await Video.findById(_id)

    if (!video) {
      throw new Error({ error: 'Invalid video id' })
    }

    await video.updateOne(rest)
    await video.save()

    const updatedVideo = await Video.findById(_id)

    res.json({ video: updatedVideo })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post(
  '/videos',
  [auth, ...videoSanitaizer, upload.single('videoThumbnail'), resize],
  async (req, res) => {
    try {
      const { _id, ...rest } = req.body;

      const video = new Video({ ...rest, videoThumbnail: req.file.filename });
      await video.save();

      res.status(201).send({ video });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.delete('/videos', [auth, query('id').isUUID()], async (req, res) => {
  try {
    if (req.query.id) {
      const video = await Video.findById(req.query.id)

      if (video.videoThumbnail) {
        originalFileLoc = path.join(path.resolve(staticBasePath), `original_${video.videoThumbnail}`)
        thumbFileLoc = path.join(path.resolve(staticBasePath), video.videoThumbnail)
        await fs.unlink(originalFileLoc, function(err) {
          if (err) throw err
        })
        await fs.unlink(thumbFileLoc, function(err) {
          if (err) throw err
        })
      }

       Video.deleteOne({ _id: req.query.id }, function(err) {
        if (err) {
          throw { error: err };
        }

        res.json({ success: true });
      });
    }
  } catch (e) {
    res.status(400).json({error: e});
  }
});

module.exports = router;
