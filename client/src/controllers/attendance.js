import { Api } from '@/Api'

import userController from '@/controllers/user'
import postController from '@/controllers/post'

async function attend(course) {
  if (!course) throw new Error('No course provided')

  await Api.patch(`/attendance/${course._id}`, {}, {})
  const user = this.getUser()
  course.attendees.push(user._id)
  this.loadUser()
}

async function unattend(course) {
  if (!course) throw new Error('No course provided')

  await Api.delete(`/attendance/${course._id}`, {}, {})
  const user = this.getUser()

  course.attendees.splice(course.attendees.indexOf(user._id), 1)
  this.loadUser()
}

export default {
  methods: {
    attend,
    unattend
  },
  mixins: [userController, postController]
}
