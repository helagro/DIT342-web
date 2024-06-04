const { ResCode } = require('../helpers')
const User = require('../models/user')

exports.create = async (email, username, password, firstName, lastName, age) => {
  if (!email || !username || !password) return ResCode.MISSING_ARGUMENT

  const user = new User({
    email: email,
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    age: age,
    attends: []
  })

  try {
    const result = await user.save()

    return {
      resCode: ResCode.SUCCESS,
      data: result
    }
  } catch (err) {
    if (err.code == 11000) return ResCode.ITEM_ALREADY_EXISTS
    return ResCode.ERROR
  }
}

exports.get = async (id) => {
  return await User.findById(id)
}

exports.find = async (username) => {
  return await User.findOne({ username: username })
}

exports.patch = async (id, email, password, firstName, lastName, age) => {
  const update = {}

  if (email !== undefined) update['email'] = email
  if (password !== undefined) update['password'] = password
  if (firstName !== undefined) update['firstName'] = firstName
  if (lastName !== undefined) update['lastName'] = lastName
  if (age !== undefined) update['age'] = age

  try {
    const item = await User.findOneAndUpdate(id, update, { new: true })

    if (item) return ResCode.SUCCESS
    else return ResCode.NOT_FOUND
  } catch (_) {
    return ResCode.ERROR
  }
}
