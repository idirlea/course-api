const mongoose = require("mongoose");
const config = require("dotenv").config();

const conn = mongoose.createConnection(config.parsed.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

conn.on("open", function() {
  conn.GridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

module.exports = conn
