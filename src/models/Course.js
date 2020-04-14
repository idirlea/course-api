const conn = require("../db/db");
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

const Course = conn.model("Course", courseSchema);

module.exports = Course;