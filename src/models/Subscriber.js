const mongoose = require('mongoose')
const validator = require('validator')

const subscriberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: 'Invalid Email address' })
        }
      },
    },
    confirmed: { type: Boolean, require: false, default: false },
    userLink: { type: String, require: false, default: null }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

module.exports = subscriberSchema