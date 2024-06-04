const { idToObj, ResCode } = require('../helpers')
const Review = require('../models/review')
const mongoose = require('mongoose')
const { logError } = require('../helpers')
const ValidationError = mongoose.Error.ValidationError

exports.create = async ({ text, strPostID, rating, userID, username, reviewID = null }) => {
  //valid postID?
  const postID = idToObj(strPostID)
  if (!postID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid post ID'
    }

  //post exists?
  const post = await require('./post').get(postID)
  if (!post)
    return {
      resCode: ResCode.NOT_FOUND,
      error: 'Post not found'
    }

  const review = new Review({
    text: text,
    post: postID,
    rating: rating,
    user: userID,
    username: username
  })

  try {
    if (reviewID) review._id = reviewID

    await review.save()
    post.reviews.push(review)
    await post.save()

    return {
      resCode: ResCode.SUCCESS,
      data: { ...review._doc, index: post.reviews.length - 1 }
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        resCode: ResCode.BAD_INPUT,
        data: err
      }
    } else {
      console.log(err)
      return ResCode.ERROR
    }
  }
}

exports.getAllFromPost = (post) => Review.find({ post: post }).sort({ createdAt: -1 })

exports.get = (id) => Review.findById(id)

exports.getByPostIndex = async (strPostID, index) => {
  const postID = idToObj(strPostID)
  if (!postID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid post ID'
    }

  const post = await require('./post').get(postID)
  if (!post)
    return {
      resCode: ResCode.NOT_FOUND,
      error: 'Post not found'
    }

  if (!post.reviews || index >= post.reviews.length)
    return {
      resCode: ResCode.NOT_FOUND,
      error: 'Review not found'
    }

  const strReviewID = post.reviews[index]
  const reviewID = idToObj(strReviewID)
  if (!reviewID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid review ID'
    }

  const review = await Review.findById(reviewID)
  if (!review)
    return {
      resCode: ResCode.NOT_FOUND,
      error: 'Review not found'
    }

  return {
    resCode: ResCode.SUCCESS,
    data: review
  }
}

exports.put = async ({ text, strPostID, rating, userID, id, username }) => {
  //has postID?
  if (!strPostID)
    return {
      resCode: ResCode.MISSING_ARGUMENT,
      error: 'Missing post ID'
    }

  //valid postID?
  const postID = idToObj(strPostID)
  if (!postID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid post ID'
    }

  //valid reviewID?
  const reviewID = idToObj(id)
  if (!reviewID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid review ID'
    }

  //review exists?
  const review = await Review.findById(reviewID)
  if (!review) return await exports.create({ text, strPostID, rating, userID, reviewID, username })

  //user owns review?
  if (!userID.equals(review.user))
    return {
      resCode: ResCode.UNAUTHORIZED,
      error: 'User does not own review'
    }

  //postID matches review?
  if (!postID.equals(review.post))
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Post ID does not match review'
    }

  //update review
  try {
    review.text = text
    review.rating = rating
    await review.save()

    return {
      resCode: ResCode.SUCCESS,
      data: review
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        resCode: ResCode.BAD_INPUT,
        data: err
      }
    } else {
      console.log(err)
      return ResCode.ERROR
    }
  }
}

exports.delete = async (review, strPostID, userID) => {
  if (!review.user.equals(userID))
    return {
      resCode: ResCode.UNAUTHORIZED,
      error: 'User does not own review'
    }

  const postID = idToObj(strPostID)
  if (!postID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid post ID'
    }

  const post = await require('./post').get(postID)
  if (!post)
    return {
      resCode: ResCode.NOT_FOUND,
      error: 'Post not found'
    }

  const newReviews = post.reviews.filter((re) => !re.equals(review._id))
  post.reviews = newReviews

  try {
    await post.save()
    await review.deleteOne()

    return {
      resCode: ResCode.SUCCESS,
      data: review
    }
  } catch (err) {
    logError(err)
    return {
      resCode: ResCode.ERROR
    }
  }
}
