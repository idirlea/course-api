const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, default: null },
    mediaType: { type: String, required: true, default: null },
    mediaId: { type: String, required: true, default: null },
    userId: { type: String, required: true, default: null }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

module.exports = likeSchema
