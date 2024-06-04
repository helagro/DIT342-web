const postRouter = require('../routers').post
const reviewRouter = require('../routers').review

const controller = require('../db/controllers/review')
const auth = require('../authMiddleware')
const { ResCode } = require('../db/helpers')

postRouter.post('/:postId/reviews', auth, async (req, res) => {
  const result = await controller.create({
    text: req.body.text,
    username: req.body.username,
    strPostID: req.params.postId,
    rating: req.body.rating,
    userID: req.userID
  })

  switch (result.resCode) {
    case ResCode.SUCCESS:
      res.status(201).json(result?.data)
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({ message: result?.error })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: result?.error })

    default:
      res.status(500).json({
        message: 'Failed to create review',
        resCode: result?.resCode.number
      })
      break
  }
})

postRouter.get('/:postId/reviews', async (req, res) => {
  try {
    const reviews = await controller.getAllFromPost(req.params.postId)

    if (reviews === null) throw new Error('Cannot find reviews')

    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

postRouter.get('/:postId/reviews/:index', getReview, async (req, res) => {
  res.send(res.review)
})

postRouter.delete('/:postId/reviews/:index', auth, getReview, async (req, res) => {
  const result = await controller.delete(res.review, req.params.postId, req.userID)

  switch (result.resCode) {
    case ResCode.SUCCESS:
      res.status(200).json(result?.data)
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: result?.error })
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({ message: result?.error })
      break
    case ResCode.UNAUTHORIZED:
      res.status(403).json({ message: result?.error })
      break

    default:
      res.status(500).json({
        message: 'Failed to delete review',
        resCode: result?.resCode.number
      })
      break
  }
})

reviewRouter.put('/:id', auth, async (req, res) => {
  const result = await controller.put({
    strPostID: req.body.postID,
    username: req.body.username,
    userID: req.userID,
    text: req.body.text,
    rating: req.body.rating,
    id: req.params.id
  })

  switch (result.resCode) {
    case ResCode.SUCCESS:
      res.status(200).json(result?.data)
      break
    case ResCode.MISSING_ARGUMENT:
      res.status(422).json({ message: result?.error })
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({ message: result?.error })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: result?.error })
      break
    case ResCode.UNAUTHORIZED:
      res.status(403).json({ message: result?.error })
      break

    default:
      res.status(500).json({ message: 'Failed to update review' })
      break
  }
})

async function getReview(req, res, next) {
  const result = await controller.getByPostIndex(req.params.postId, req.params.index)

  switch (result.resCode) {
    case ResCode.SUCCESS:
      res.review = result?.data
      next()
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: result?.error })
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({ message: result?.error })
      break

    default:
      res.status(500).json({ message: 'Failed to get review' })
      break
  }
}
