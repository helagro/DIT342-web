import Vue from 'vue'
import Router from 'vue-router'

import Welcome from './views/Welcome.vue'
import CreatePost from './views/CreatePost.vue'
import Register from './views/Register.vue'
import AllPosts from './views/AllPosts.vue'
import PostManager from './views/PostManager.vue'
import User from './views/User.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/posts/creation',
      name: 'createPost',
      component: CreatePost
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/posts',
      name: 'post',
      component: AllPosts
    },
    {
      path: '/posts/:id',
      name: 'postManager',
      component: PostManager
    }
  ]
})
