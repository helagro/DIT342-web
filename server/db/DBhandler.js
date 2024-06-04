const mongoose = require('mongoose')
require('dotenv').config()

var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animalDevelopmentDB'

exports.connectToDB = () => {
  mongoose
    .connect(mongoURI)
    .then((_) => {
      console.log(`Connected to MongoDB with URI: ${mongoURI}`)
    })
    .catch((err) => {
      if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`)
        console.error(err.stack)
        process.exit(1)
      }
    })
}
