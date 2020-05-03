const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: false,
    trim: true,
  },
  seoLink: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type:Boolean,
    required: false,
    default: false
  }
});



module.exports = pageSchema