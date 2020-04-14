const conn = require("../db/db");

const Comment = conn.model(
  "Comment",
  new mongoose.Schema({
    username: String,
    text: String,
    createdAt: Date
  })
);

module.exports = Comment;
