const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    streamSource: {
      type: String,
      required: false,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: false,
      trim: true,
    },
    videoThumbnail: {
      type: String,
      required: false,
      trim: true,
    },
    views: {
      type: Number,
      required: false,
      default: 0,
    },
    likes: {
      type: Number,
      required: false,
      default: 0,
    },
    category: {
      type: String,
      required: false,
      default: null,
    },
    isFree: {
      type: Boolean,
      required: false,
      default: false
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);



module.exports = videoSchema