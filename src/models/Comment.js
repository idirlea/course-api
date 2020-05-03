const commentSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: Date,
})

module.exports = commentSchema;
