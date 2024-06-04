const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  age: Number,
  attends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
})

module.exports = mongoose.model('User', schema)
