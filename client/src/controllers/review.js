const { Api } = require('@/Api')

const createReview = (postID, username, rating, text) =>
  Api.post(`/posts/${postID}/reviews`, {
    username,
    rating,
    text
  })

const getReviews = async (postID) => {
  const result = await Api.get(`/posts/${postID}/reviews`)
  return result.data
}

export default { methods: { createReview, getReviews } }
