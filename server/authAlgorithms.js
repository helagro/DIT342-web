const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET

exports.hash = async (password) => {
  const salt = await bcrypt.genSalt(10)

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
}

exports.match = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

exports.getJWT = (userID) => {
  return jwt.sign({ userID: userID }, jwtSecret)
}

exports.verifyJWT = (token) => {
  return jwt.verify(token, jwtSecret)
}
