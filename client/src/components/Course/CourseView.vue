<template>
  <div>
    <button
      v-if="ownsCourse(course)"
      class="edit-btn"
      @click="editCourse(course)"
    >
      EDIT
    </button>

    <div class="info-container">
      <h4>
        <a :href="postURL">{{ postName }}</a>
      </h4>
      <p>
        <strong>Attendance:</strong>
        {{ attendanceRatioStr }}
      </p>
      <p>
        <span>
          <strong>Starting:</strong>
          {{ myFormatDate(course.start) }},
        </span>
        <span>
          <strong>Duration:</strong>
          {{ durationStr(course.duration) }}
        </span>
      </p>
      <p v-if="course.city">
        <strong>City:</strong>
        {{ course.city }}
      </p>
    </div>

    <button
      v-if="isAttendingBool === true"
      @click="onUnAttend()"
      class="attendance-btn"
    >
      Unregister
    </button>
    <button
      v-else-if="isAttendingBool === false && !ownsCourse(course)"
      @click="onAttend()"
      class="attendance-btn"
    >
      Register
    </button>
  </div>
</template>

<script>
import { errorHandler } from '@/Api'
import helpers from '@/helpers'
import courseItemStyle from '@/styles/courseItem.css'
/* ------------------------------- CONTROLLERS ------------------------------ */
import userController from '@/controllers/user'
import courseControllers from '@/controllers/course'
import attendanceController from '@/controllers/attendance'

export default {
  props: {
    course: Object,
    reload: Function,
    showCourseName: Boolean
  },
  data() {
    return {
      isAttendingBool: undefined,
      attendanceRatioStr: this.attendanceRatio(),
      postName: null,
      postURL: null
    }
  },
  mounted() {
    this.isAttending()

    if (this.showCourseName) this.loadCourseName()
  },
  methods: {
    /* ------------------------------ SETUP METHODS ----------------------------- */
    attendanceRatio() {
      const { attendees, maxAttendees } = this.course
      return `${attendees.length}/${maxAttendees}`
    },

    isAttending() {
      this.isAttendingAsync(this.course).then((response) => {
        this.isAttendingBool = response
      })
    },

    durationStr(duration) {
      if (!duration) return ''
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60

      let result = ''
      if (hours > 0) result += `${hours} hours `
      if (minutes > 0) result += `${minutes} minutes`

      return result
    },

    loadCourseName() {
      this.getPostLink(this.course)
        .then((response) => {
          this.postName = response.name
          this.postURL = response.url
        })
        .catch(errorHandler)
    },

    /* ------------------------------- ATTENDANCE ------------------------------- */
    onAttend() {
      this.attend(this.course)
        .then((_) => {
          this.isAttendingBool = true
          this.attendanceRatioStr = this.attendanceRatio()
        })
        .catch(errorHandler)
    },

    onUnAttend() {
      this.unattend(this.course)
        .then((_) => {
          this.isAttendingBool = false
          this.attendanceRatioStr = this.attendanceRatio()
        })
        .catch(errorHandler)
    },

    /* ------------------------- EVENT TRIGGERED METHODS ------------------------ */
    editCourse(course) {
      course.editing = true
      this.$emit('onEdit')
    }
  },
  mixins: [helpers, userController, courseControllers, attendanceController],
  styles: [courseItemStyle]
}
</script>

<style scoped>
/* ------------------------------ INFO CONTENT ------------------------------ */

.info-container {
  line-height: 1.2em;
  margin-top: 1em;
  letter-spacing: 0.04em;
  color: #0e4647;
}

.info-container a {
  color: var(--primary-dark) !important;
}

.info-container span {
  margin: 0 0.2em;
}

.info-container strong {
  font-weight: 600;
}

/* --------------------------- EDIT COURSE BUTTON --------------------------- */

.edit-btn {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  font-size: 1.4em;
  border: none;
  background-color: transparent;
  color: var(--primary-color);
}

/* ----------------------------- ATTENDANCE BTN ----------------------------- */

.attendance-btn {
  margin-top: 0.5em;
  color: var(--primary-color);
  background-color: #fcffff;
  padding: 0.4em min(5%, 2.7em);
  font-weight: 400;
  border: 0.1em solid var(--primary-color);
  letter-spacing: 0.06em;
  transition: background-color 0.3s, color 0.25s;
}

.attendance-btn:active {
  box-shadow: none;
  background-color: var(--primary-color);
  color: #fcffff;
}
</style>
