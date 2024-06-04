const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)
