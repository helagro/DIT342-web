import { Api } from '@/Api'
import userController from '@/controllers/user'
import postController from '@/controllers/post'

const postCourse = (course) =>
  Api.post(`/posts/${course.postID}/courses`, course)

const putCourse = (course) => Api.put(`/courses/${course._id}`, course)

const deleteCourse = (course) => Api.delete(`/courses/${course._id}`)

async function getPostLink(course) {
  const post = await this.getPost(course.postID)
  return {
    name: post.postName,
    url: post._links.selfPage.href
  }
}

export default {
  methods: {
    postCourse,
    putCourse,
    deleteCourse,
    getPostLink
  },
  mixins: [userController, postController]
}
