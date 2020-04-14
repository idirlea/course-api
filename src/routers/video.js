const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const upload = require('../middleware/upload')

router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find({});

    if (!videos) {
      return res.status(401).send({ error: "Fetching videos failed!" });
    }
    res.json([...videos]);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/videos", async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    const video = await Video.findById(_id);

    if (!video) {
      throw new Error({ error: "Invalid video id" });
    }

    await video.updateOne(rest);
    await video.save();

    const updatedVideo = await Video.findById(_id);

    res.json({ video: updatedVideo });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/videos", upload.single('videoThumbnail'), async (req, res) => {
  try {

    const {_id, ...rest} = req.body;

    const video = new Video({ ...rest, videoThumbnail: req.file.filename });
    await video.save();

    res.status(201).send({ video });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/videos", async (req, res) => {
  try {
    if (req.query.id) {
      Video.deleteOne({ _id: req.query.id }, function(err) {
        if (err) {
          throw { error: err };
        }

        res.json({ success: true });
      });
    }
  } catch (e) {
    res.status(400).send(error);
  }
});

module.exports = router;