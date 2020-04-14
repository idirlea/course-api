const express = require("express");
const router = express.Router();
const conn = require('../db/db')

router.get("/image/:filename", (req, res) => {
  conn.GridFSBucket.find({
    filename: req.params.filename
  }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }
    conn.GridFSBucket.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

module.exports = router;
