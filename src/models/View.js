const mongoose = require('mongoose')

const viewSchema = new mongoose.Schema(
  {
    ip: String,
    mediaType: String,
    mediaId: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

module.exports = viewSchema
