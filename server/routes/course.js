const courseRouter = require('../routers').course
const postRouter = require('../routers').post

const controller = require('../db/controllers/course')
const { ResCode, sort } = require('../db/helpers')
const auth = require('../authMiddleware')
const links = require('../hateoasLinks')

postRouter.post('/:id/courses', auth, async (req, res) => {
  const start = new Date(req.body?.start)

  const response = await controller.create(
    req.userID,
    req.params.id,
    req.body?.meetingLink,
    start,
    req.body?.duration,
    req.body?.city,
    req.body?.address,
    req.body?.maxAttendees
  )

  switch (response.resCode) {
    case ResCode.SUCCESS:
      res.status(201).json(response.data)
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({ message: 'Bad input' })
      break
    case ResCode.UNAUTHORIZED:
      res.status(401).json({ message: 'User does not own post' })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: 'Post not found' })
      break

    default:
      res.status(500).json({
        message: 'Failed to create course',
        code: response?.resCode,
        error: response?.data
      })
      break
  }
})

postRouter.get('/:id/courses', auth, async (req, res) => {
  const response = await controller.getAllFromPost(req.params.id, req.query.filter)

  sort(req.query.sort, response.data)

  switch (response.resCode) {
    case ResCode.BAD_INPUT:
      res.status(400).json({ message: 'Post ID is invalid' })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: 'Course not found' })
      break
    case ResCode.SUCCESS:
      res.status(200).json(response.data)
      break

    default:
      res.status(500).json({ message: 'Internal server error' })
      break
  }
})

//GET courses posted by logged in user
courseRouter.get('/posted-courses', auth, async (req, res) => {
  const courses = await controller.getAllFromUser(req.userID)

  if (courses === null) {
    res.status(500).json({ message: 'Something went wrong' })
    return
  }

  res.status(200).json(courses)
})

//GET courses attending by logged in user
courseRouter.get('/attending-courses', auth, async (req, res) => {
  const result = await controller.getAllUserAttends(req.userID)

  switch (result.resCode) {
    case ResCode.BAD_INPUT:
      res.status(400).json({
        message: 'Bad input',
        error: result?.error
      })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: 'User not found' })
      break
    case ResCode.SUCCESS:
      res.status(200).json(result.data)
      break

    default:
      res.status(500).json({ message: 'Internal server error' })
      break
  }
})

courseRouter.get('/:id', async (req, res) => {
  const course = await controller.get(req.params.id)
  if (!course) {
    res.status(404).json({ message: 'Course not found' })
    return
  }

  res.status(200).json(course)
})

courseRouter.put('/:id', auth, async (req, res) => {
  const result = await controller.put({
    strCourseID: req.params.id,
    userID: req.userID,
    strPostID: req.body?.postID,
    meetingLink: req.body?.meetingLink,
    start: req.body?.start,
    duration: req.body?.duration,
    city: req.body?.city,
    address: req.body?.address,
    maxAttendees: req.body?.maxAttendees
  })

  switch (result.resCode) {
    case ResCode.SUCCESS:
      const data = { ...result?.data }._doc
      data._links = {
        getCourse: links.getCourse(data._id)
      }
      res.status(200).json(data)
      break
    case ResCode.BAD_INPUT:
      const message = result?.badProperties
        ? `The value(s) for ${result?.badProperties?.join(', ')} is/are invalid`
        : 'Bad input'
      res.status(400).json({
        message: message,
        error: result?.data
      })
      break
    case ResCode.UNAUTHORIZED:
      res.status(401).json({ message: 'User does not own post' })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: `Post '${result.data}' not found` })
      break

    default:
      console.log(result.resCode == ResCode.NOT_FOUND, 'hiefa')
      res.status(500).json({
        message: `Internal server error. Code ${result.resCode.number}`,
        error: result?.error
      })
  }
})

//DELETES all courses created by the logged in user
courseRouter.delete('/', auth, async (req, res) => {
  const response = await controller.deleteAllFromUser(req.userID)

  switch (response.resCode) {
    case ResCode.SUCCESS:
      res.status(200).json({
        message: 'Successful deletion',
        amtDeleted: response?.amtDeleted
      })
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({
        message: 'Bad input',
        error: response?.error
      })
      break
    case ResCode.NOT_FOUND:
      res.status(200).json({
        message: 'No courses to delete',
        amtDeleted: response?.amtDeleted
      })
      break

    default:
      res.status(500).json({
        message: 'Internal server error',
        error: response?.error
      })
      break
  }
})

courseRouter.delete('/:id', auth, async (req, res) => {
  const response = await controller.delete(req.params.id, req.userID)

  switch (response.resCode) {
    case ResCode.SUCCESS:
      res.status(200).json({ message: `Successful deletion` })
      break
    case ResCode.BAD_INPUT:
      res.status(400).json({
        message: 'Bad input',
        error: response?.error
      })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: 'Course does not exist' })
      break
    case ResCode.UNAUTHORIZED:
      res.status(401).json({ message: 'User is not authorized to delete course' })
      break

    default:
      res.status(500).json({ message: 'Internal server error' })
      break
  }
})
