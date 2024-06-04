const { ResCode, idToObj } = require('../helpers')
const { ValidationError } = require('mongoose').Error

const Post = require('../models/post')
const Review = require('../models/review')

const validImageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']

/* --------------------------------- HELPERS -------------------------------- */
exports.isValidMimeType = (mimeType) => validImageMimeTypes.includes(mimeType)

exports.postValidation = async (userID, strPostID) => {
  //valid postID?
  const postID = idToObj(strPostID)
  if (!postID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid postID'
    }

  //post exists?
  const post = await Post.findById(postID)
  if (!post)
    return {
      resCode: ResCode.NOT_FOUND,
      error: `Post ${postID} not found`
    }

  //user owns post?
  if (!userID.equals(post.user))
    return {
      resCode: ResCode.UNAUTHORIZED,
      error: 'User does not own post'
    }

  return {
    resCode: ResCode.SUCCESS,
    postID: postID
  }
}

const saveImageFile = (post, imageFile) => {
  const isValidMimeType = exports.isValidMimeType(imageFile?.mimetype)

  if (imageFile != null && isValidMimeType) {
    post.postImage = imageFile.buffer
    post.postImageType = imageFile.mimetype
  }
}

/* ------------------------------ DB OPERATIONS ------------------------------ */
exports.create = async (postName, cookingTime, ingredients, description, recipe, user, image) => {
  const newPost = new Post({
    postName,
    cookingTime,
    ingredients,
    description,
    recipe,
    user
  })

  saveImageFile(newPost, image)

  try {
    const savedPost = await newPost.save()

    return {
      resCode: ResCode.SUCCESS,
      data: savedPost
    }
  } catch (err) {
    if (err instanceof ValidationError)
      return {
        resCode: ResCode.BAD_INPUT,
        error: err.message
      }
    else console.error(err.stack)
    return {
      resCode: ResCode.ERROR
    }
  }
}

//** Does not return image */
exports.get = (postID) => Post.findById(postID, { postImage: 0 })

//** Does not return images */
exports.find = (query, skip, limit) => {
  let command = Post.find(query, { postImage: 0 })

  if (skip && limit) command = command.skip(skip).limit(limit)
  return command.exec()
}

exports.count = (query) => Post.countDocuments(query)

exports.getImage = (postID) => Post.findById(postID, { postImage: 1, postImageType: 1 })

/* Does not return images */
exports.findByUser = (userID) => Post.find({ user: userID }, { postImage: 0 })

exports.patch = async (
  postID,
  postName,
  cookingTime,
  ingredients,
  description,
  recipe,
  userID,
  image
) => {
  const isValidMimeType = exports.isValidMimeType(image?.mimetype)

  const update = {}
  if (postName !== undefined) update['postName'] = postName
  if (cookingTime !== undefined) update['cookingTime'] = cookingTime
  if (ingredients !== undefined) update['ingredients'] = ingredients
  if (description !== undefined) update['description'] = description
  if (recipe !== undefined) update['recipe'] = recipe
  if (image !== undefined && isValidMimeType) {
    update['postImage'] = image.buffer
    update['postImageType'] = image.mimetype
  }

  try {
    const item = await Post.findOneAndUpdate(
      {
        _id: postID,
        user: userID
      },
      update,
      { new: true }
    )

    if (item) return ResCode.SUCCESS
    else {
      if (await Post.findById(postID)) return ResCode.UNAUTHORIZED
      else return ResCode.NOT_FOUND
    }
  } catch (error) {
    return {
      resCode: ResCode.ERROR,
      error: error.message
    }
  }
}

/** DOESN'T AUTHENTICATE USER */
exports.delete = async (post) => {
  try {
    await Review.deleteMany({ post: post.id })
    await post.deleteOne()

    return await require('./course').deleteAllFromPost(post.id)
  } catch (err) {
    return {
      resCode: ResCode.ERROR,
      error: err.message
    }
  }
}
