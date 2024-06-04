const router = require('../routers').login

const controller = require('../db/controllers/user')
const auth = require('../authAlgorithms')
const links = require('../hateoasLinks')

router.post('/', async (req, res) => {
  //provided password?
  const password = req.body?.password
  if (password === undefined) {
    res.status(422).json({ message: 'Password missing' })
    return
  }

  //provided username?
  const username = req.body?.username
  if (username === undefined) {
    res.status(422).json({ message: 'Username missing' })
    return
  }

  //does user exist?
  const user = await controller.find(username)
  if (!user) {
    res.status(404).json({
      message: 'User does not exist',
      _links: {
        createUser: links.createUser(),
        createUserPage: links.createUserPage()
      }
    })
    return
  }

  //right password?
  const authenticated = await auth.match(password, user.password)
  if (!authenticated) {
    res.status(401).json({ message: 'Wrong password' })
    return
  }

  const jwt = auth.getJWT(user._id)
  res.status(200).json({
    jwt,
    _links: {
      homePage: links.getPostsPage(),
      getPosts: links.getPosts()
    }
  })
})
