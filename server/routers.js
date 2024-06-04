const express = require('express')

const basePath = '/api/v1'

exports.init = (app) => {
  const Router = (path) => {
    const router = express.Router()
    const routerPath = basePath + path
    app.use(routerPath, router)
    return router
  }

  exports.base = Router('/')
  exports.course = Router('/courses')
  exports.login = Router('/login')
  exports.post = Router('/posts')
  exports.review = Router('/reviews')
  exports.user = Router('/users')
}
