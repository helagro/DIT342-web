const { idToObj, ResCode, ValidationError } = require('../helpers')
const { userRemoveCourse } = require('./attendance')
const { postValidation } = require('./post')
const Course = require('../models/course')

exports.create = async (
  userID,
  strPostID,
  meetingLink,
  start,
  duration,
  city,
  address,
  maxAttendees,
  courseID = null
) => {
  //valid post?
  const postResponse = await require('./post').postValidation(userID, strPostID)
  if (postResponse.resCode !== ResCode.SUCCESS) return postResponse

  const course = new Course({
    userID: userID,
    postID: postResponse.postID,
    meetingLink: meetingLink,
    start: start,
    duration: duration,
    city: city,
    address: address,
    attendees: [],
    maxAttendees: maxAttendees
  })

  try {
    if (courseID) course._id = courseID

    const data = await course.save()

    return {
      resCode: ResCode.SUCCESS,
      data: data
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        resCode: ResCode.BAD_INPUT,
        data: err
      }
    } else {
      console.log(err)
      return ResCode.ERROR
    }
  }
}

exports.get = async (strID) => {
  const id = idToObj(strID)
  if (!id) return

  return Course.findById(id)
}

exports.getAllFromUser = async (userID) => {
  return Course.find({ userID: userID })
}

exports.getAllUserAttends = async (strUserID) => {
  const userID = idToObj(strUserID)
  if (!userID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid user ID'
    }

  const user = await require('./user').get(userID)
  if (!user) return ResCode.NOT_FOUND

  const courseIDs = user?.attends
  if (!courseIDs)
    return {
      resCode: ResCode.SUCCESS,
      data: []
    }

  const courses = []
  for (const courseID of courseIDs) {
    const course = await exports.get(courseID)
    if (course) courses.push(course)
  }

  return {
    resCode: ResCode.SUCCESS,
    data: courses
  }
}

exports.getAllFromPost = async (strPostID, requestedFilter) => {
  const postID = idToObj(strPostID)
  if (!postID) return ResCode.BAD_INPUT

  const filter = {
    postID: postID
  }

  if (requestedFilter === 'notFull')
    filter.$expr = { $lt: [{ $size: '$attendees' }, '$maxAttendees'] } //inspired by ChatGPT

  const courses = await Course.find(filter)
  if (!courses) return ResCode.NOT_FOUND

  return {
    resCode: ResCode.SUCCESS,
    data: courses
  }
}

exports.put = async ({
  strCourseID,
  userID,
  strPostID,
  meetingLink,
  start,
  duration,
  city,
  address,
  maxAttendees
}) => {
  //valid courseID?
  const courseID = idToObj(strCourseID)
  if (!courseID)
    return {
      resCode: ResCode.BAD_INPUT,
      data: 'Invalid course ID: ' + strCourseID
    }

  //valid post?
  const postResponse = await postValidation(userID, strPostID)
  if (postResponse.resCode !== ResCode.SUCCESS) return postResponse

  //create course instead if it does not exist
  const course = await Course.findById(courseID)
  if (!course)
    return exports.create(
      userID,
      strPostID,
      meetingLink,
      start,
      duration,
      city,
      address,
      maxAttendees,
      courseID
    )

  //updates course
  try {
    course.meetingLink = meetingLink
    course.start = start
    course.duration = duration
    course.city = city
    course.address = address
    course.maxAttendees = maxAttendees
    course.postID = postResponse.postID

    await course.save()

    return {
      resCode: ResCode.SUCCESS,
      data: course
    }
  } catch (err) {
    const badVariables = Object.keys(err?.errors)
    return {
      resCode: ResCode.BAD_INPUT,
      data: err,
      badProperties: badVariables
    }
  }
}

exports.deleteAllFromUser = async (userID) => {
  //has courses?
  const courses = await Course.find({ userID: userID })
  if (!courses || courses.length === 0)
    return {
      resCode: ResCode.NOT_FOUND,
      amtDeleted: 0
    }

  let resCodeResult = {
    resCode: ResCode.SUCCESS,
    amtDeleted: 0
  }
  for (const course of courses) {
    const resCode = await deleteObjID(course._id)
    if (resCode != ResCode.SUCCESS && resCode != ResCode.NOT_FOUND)
      resCodeResult.resCode = resCode.resCode
    else resCodeResult.amtDeleted++
  }

  return resCodeResult
}

exports.deleteAllFromPost = async (postID) => {
  try {
    await Course.deleteMany({ postID: postID })
    return ResCode.SUCCESS
  } catch (err) {
    return {
      resCode: ResCode.ERROR,
      error: 'Failed to delete course from post'
    }
  }
}

exports.delete = async (strCourseID, userID) => {
  //valid courseID?
  const courseID = idToObj(strCourseID)
  if (!courseID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid course ID'
    }

  //course exists?
  const course = await Course.findById(courseID)
  if (!course) return ResCode.NOT_FOUND

  //course belongs to user?
  if (!userID.equals(course.userID)) return ResCode.UNAUTHORIZED

  return deleteObjID(courseID)
}

async function deleteObjID(courseID) {
  const course = await Course.findByIdAndDelete(courseID)
  if (!course) return ResCode.NOT_FOUND

  //removes attendance from the users´ profiles
  var resCodeResult = ResCode.SUCCESS
  for (const attendee of course.attendees) {
    const resCode = await userRemoveCourse(attendee, course._id)
    if (resCode != ResCode.SUCCESS) {
      resCodeResult = {
        resCode: resCode,
        data: 'Failed to remove attendance from user(s)'
      }
    }
  }

  return resCodeResult
}
