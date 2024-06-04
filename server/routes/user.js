const router = require('../routers').user

const controller = require('../db/controllers/user')
const authAlgorithms = require('../authAlgorithms')
const authMiddleware = require('../authMiddleware')
const { ResCode } = require('../db/helpers')
const links = require('../hateoasLinks')

// CREATE user
router.post('/', async (req, res) => {
  //hashes password
  const password = req.body?.password
  if (!password) {
    res.status(422).json({ message: 'Missing password' })
    return
  }

  let hash
  try {
    hash = await authAlgorithms.hash(password)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create account' })
    return
  }

  const result = await controller.create(
    req.body?.email,
    req.body?.username,
    hash,
    req.body?.firstName,
    req.body?.lastName,
    req.body?.age
  )

  switch (result.resCode) {
    case ResCode.SUCCESS:
      const data = { ...result?.data }._doc
      data._links = {
        login: links.login()
      }
      res.status(201).json(data)
      break
    case ResCode.ITEM_ALREADY_EXISTS:
      res.status(403).json({ message: 'Username is already taken' })
      break
    case ResCode.MISSING_ARGUMENT:
      res.status(422).json({ message: 'Missing parameters' })
      break

    default:
      res.status(500).json({ message: 'Failed to create account' })
      break
  }
})

// READ user info (for the logged in user)
router.get('/', authMiddleware, async (req, res) => {
  const user = await controller.get(req.userID)
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.status(200).json({
    email: user.email,
    username: user.username,
    firstName: user?.firstName,
    lastName: user?.lastName,
    age: user?.age,
    _id: user._id,
    attends: user?.attends
  })
})

// UPDATE user info (for the logged in user)
router.patch('/', authMiddleware, async (req, res) => {
  const response = await controller.patch(
    req.userID,
    req.body?.email,
    req.body?.password,
    req.body?.firstName,
    req.body?.lastName,
    req.body?.age
  )

  switch (response?.resCode) {
    case ResCode.SUCCESS:
      res.status(200).json({ message: 'User updated successfully' })
      break
    case ResCode.NOT_FOUND:
      res.status(404).json({ message: 'User does not exist' })
      break

    default:
      res.status(500).json({ message: 'Internal server error' })
      break
  }
})
