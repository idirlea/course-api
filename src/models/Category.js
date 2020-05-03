const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = categorySchema
