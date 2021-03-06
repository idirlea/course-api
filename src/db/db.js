const mongoose = require("mongoose");
const config = require("dotenv").config();

const videoSchema = require('../models/Video')
const pageSchema = require('../models/Page');
const courseSchema = require('../models/Course');
const viewSchema = require('../models/View');
const likeSchema = require('../models/Like')
const categorySchema  = require('../models/Category');
const commentSchema = require('../models/Course');
const subscriberSchema = require('../models/Subscriber')

const conn = mongoose.createConnection(config.parsed.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

conn.on("open", function() {
  console.log('connected to mongodb')
});

const Category = conn.model('Category', categorySchema)
const Comment = conn.model('Comment', commentSchema)
const Course = conn.model('Course', courseSchema)
const Page = conn.model('Page', pageSchema)
const Video = conn.model('Video', videoSchema)
const View = conn.model('View', viewSchema)
const Like = conn.model('Like', likeSchema)
const Subscriber = conn.model('Subcriber', subscriberSchema)

module.exports = {
  conn,
  Video,
  Page,
  Course,
  Category,
  Comment,
  View,
  Like,
  Subscriber,
}
