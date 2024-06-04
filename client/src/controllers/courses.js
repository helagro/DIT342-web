import { Api } from '@/Api'

/* --------------------------------- GETTERS -------------------------------- */

const getVacantCourses = (postID) =>
  Api.get(`/posts/${postID}/courses?filter=notFull&sort=start`)

const getMyCourses = () => Api.get('/courses/posted-courses')

const getAttendingCourses = () => Api.get('/courses/attending-courses')

export default {
  methods: {
    deleteCourses: () => Api.delete('/courses'),

    getCourses: (getFrom, postID) => {
      switch (getFrom) {
        case 'post':
          return getVacantCourses(postID)
        case 'user':
          return getMyCourses()
        case 'userAttendance':
          return getAttendingCourses()
        default:
          throw new Error('Invalid getFrom value')
      }
    }
  }
}
