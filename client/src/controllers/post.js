import { Api } from '@/Api'

const getPosts = async (filter) => {
  const posts = await Api.get('/posts', { params: filter, cashe: false })
  return posts.data
}

const getPost = async (postID) => {
  const post = await Api.get(`/posts/${postID}`)
  return post.data
}

const createPost = (formData) =>
  Api.post('/posts', formData, {
    Headers: { 'Content-Type': 'multipart/form-data' }
  })

const updatePost = (postID, formData) =>
  Api.patch(`/posts/${postID}`, formData, {
    Headers: { 'Content-Type': 'multipart/form-data' }
  })

export default {
  methods: {
    getPosts,
    getPost,
    createPost,
    updatePost
  }
}
