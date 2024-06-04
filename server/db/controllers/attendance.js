const { ResCode, idToObj } = require('../helpers')
const Course = require('../models/course')
const User = require('../models/user')

/*
	## README ##
	- Attendance is stored in two places: the course and the user
	- courseAddUser and courseRemoveUser are used to update the course record of attendance
	- userAddCourse and userRemoveCourse are used to update the user record of attendance
*/

exports.attend = async (userID, strCourseID) => {
  //valid IDs?
  const courseID = idToObj(strCourseID)
  if (!courseID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid course ID'
    }

  //adds to attendance list in course
  let resCode = await courseAddUser(courseID, userID)
  if (resCode !== ResCode.SUCCESS) return resCode

  //adds to attendance list in user
  resCode = await userAddCourse(userID, courseID)
  //prevents half-attending user if an issue occurs
  if (resCode === ResCode.ERROR) return courseRemoveUser(courseID, userID)

  return resCode
}

exports.leave = async (userID, strCourseID) => {
  //valid courseID?
  const courseID = idToObj(strCourseID)
  if (!courseID)
    return {
      resCode: ResCode.BAD_INPUT,
      error: 'Invalid course ID'
    }

  //removes from course attendance list
  const resCodeCourse = await courseRemoveUser(courseID, userID)
  if (resCodeCourse === ResCode.ERROR) return ResCode.ERROR //not used now but safest to keep

  //removes from user attendance list
  const resCodeUser = await userRemoveCourse(userID, courseID)

  //returns error no matter which part it occurs in
  if (resCodeUser === ResCode.SUCCESS) return resCodeCourse
  else return resCodeUser
}

// ============================ COURSE RECORD ===============================

async function courseAddUser(courseID, userID) {
  const criteria = {
    _id: courseID,
    $expr: { $lt: [{ $size: '$attendees' }, '$maxAttendees'] }, //attendees not full (inspired by ChatGPT)
    attendees: { $not: { $elemMatch: { $eq: userID } } } //user has not already signed up to course (inspired by ChatGPT)
  }
  const operation = {
    $push: { attendees: userID }
  }

  try {
    const success = await Course.findOneAndUpdate(criteria, operation, {
      new: true
    })

    if (success) return ResCode.SUCCESS
    else {
      const course = await Course.findById(courseID)

      if (course) {
        if (course.attendees.length == course.maxAttendees) return ResCode.ALREADY_FULL
        else if (course.attendees.includes(userID)) return ResCode.ITEM_ALREADY_EXISTS
        else return ResCode.ERROR
      } else return ResCode.NOT_FOUND
    }
  } catch (err) {
    console.error(err)
    return ResCode.ERROR
  }
}

async function courseRemoveUser(courseID, userID) {
  const course = await Course.findByIdAndUpdate(courseID, {
    $pull: { attendees: userID }
  })

  if (course) {
    if (course.attendees.includes(userID)) return ResCode.SUCCESS
    else return ResCode.NOT_FOUND_1 // (the user was never attending the course)
  } else return ResCode.NOT_FOUND // (course not found)
}

// ============================ USER RECORD ===============================

async function userAddCourse(userID, courseID) {
  const affected = await User.findByIdAndUpdate(userID, {
    $push: { attends: courseID }
  })

  if (affected) return ResCode.SUCCESS
  else return ResCode.ERROR
}

async function userRemoveCourse(userID, courseID) {
  const affected = await User.findByIdAndUpdate(userID, {
    $pull: { attends: courseID }
  })

  if (affected) return ResCode.SUCCESS
  else return ResCode.ERROR
}
