const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    author: String,
    poster: {
      type: String,
      required: false,
      trim: true
    },
    thumbnail: {
      type: String,
      required: false,
      trim: true
    },
    subscribers: {
      type: Number,
      required: false,
      default: 0
    },
    views: {
      type: Number,
      required: false,
      default: 0
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = courseSchema