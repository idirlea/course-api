const express = require("express");
const router = express.Router();

// const ObjectId = require("mongoose").ObjectId;
// const auth = require("../middleware/auth");

const { Course } = require('../db/db')
const upload = require("../middleware/upload")
const resize = require('../middleware/resize')

var cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "poster", maxCount: 1 },
]);

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({});

    if (!courses) {
      return res.status(401).send({ error: "Fetching courses failed!" });
    }
    res.json([...(courses || [])]);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/courses', [cpUpload, resize], async (req, res) => {
  try {
    const { _id, videos, ...rest } = req.body
    const videoArray = videos.split(',') || []

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          ...rest,
          videos: videoArray,
        },
      }
    )

    res.json({ course: updatedCourse })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

router.post('/courses/editor', [upload.single('upload'), resize], async (req, res) => {
  try {
    res.status(201).send({
      fileName: req.body.videoThumbnail,
      uploaded: 1,
      url: 'http://localhost:3000/image/' + req.body.videoThumbnail
    })
  } catch (error) {
    res.status(400).json(error)
  }
})


router.post('/courses', [cpUpload, resize], async (req, res) => {
  try {
    const thumbnail = req.files && req.files['thumbnail'] && req.files['thumbnail'][0]
    const poster = req.files && req.files['poster'] && req.files['poster'][0]

    const { _id, ...rest } = req.body
    const videoArray = videos.split(',') || []

    const course = new Course({
      ...rest,
      thumbnail: (thumbnail && thumbnail.filename) || '',
      poster: (poster && poster.filename) || '',
    })

    await course.save()

    res.status(201).send({ course })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/courses", async (req, res) => {
  try {
    if (req.query.id) {
      Course.deleteOne({ _id: req.query.id }, function(err) {
        if (err) {
          throw { error: err };
        }

        res.json({ success: true });
      });
    }
  } catch (e) {
    res.status(400).json(error);
  }
});

module.exports = router;
