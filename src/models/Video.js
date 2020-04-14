const conn = require("../db/db");
const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
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
    streamSource: {
      type: String,
      required: false,
      trim: true
    },
    videoUrl: {
      type: String,
      required: false,
      trim: true
    },
    videoThumbnail: {
      type: String,
      required: false,
      trim: true
    },
    views: {
      type: Number,
      required: false,
      default: 0
    },
    likes: {
      type: Number,
      required: false,
      default: 0
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
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

const Video = conn.model("Video", videoSchema);

module.exports = Video;
