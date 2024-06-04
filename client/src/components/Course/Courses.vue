<template>
  <div class="root" ref="root">
    <!-- COURSE LIST -->
    <div v-for="course in courses" :key="course._id" class="course-item">
      <CourseEdit
        v-if="course.editing"
        :course="course"
        @save="reloadCourseList()"
        @delete="removeCourseFromList(course)"
      />
      <CourseView
        v-else
        :course="course"
        @onEdit="reloadCourseList()"
        :showCourseName="showCourseName"
      />
    </div>

    <!-- NO COURSES MESSAGE -->
    <div v-if="!courses.length" class="no-courses-container">
      <p v-if="userOwnsPost() || getFrom === 'user'">No courses posted</p>
      <p v-else>No available courses</p>
    </div>

    <!-- ADD COURSE BUTTON -->
    <div v-if="getFrom === 'post' && userOwnsPost()" class="button-container">
      <div class="btn-white-block">
        <button
          class="round-btn courses-action-button"
          @click="addCourseToLocalList()"
        >
          +
        </button>
      </div>
    </div>

    <!-- DELETE ALL COURSES BUTTON -->
    <div
      v-else-if="getFrom === 'user' && courses.length !== 0"
      class="button-container"
    >
      <div class="btn-white-block">
        <button
          class="round-btn courses-action-button"
          @click="onDeleteCoursesPressed()"
        >
          <b-icon icon="trash"></b-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { errorHandler } from '@/Api'
import roundBtnStyle from '@/styles/roundBtn.css'
/* ------------------------------- CONTROLLERS ------------------------------ */
import userController from '@/controllers/user'
import courseController from '@/controllers/courses'
/* ------------------------------- COMPONENTS ------------------------------- */
import CourseView from '@/components/Course/CourseView.vue'
import CourseEdit from '@/components/Course/CourseEdit.vue'

export default {
  mounted() {
    this.loadCourses()
  },
  data() {
    return {
      courses: [],
      showCourseName:
        this.getFrom === 'user' || this.getFrom === 'userAttendance'
    }
  },
  methods: {
    /* ------------------------------ SETUP METHODS ----------------------------- */
    loadCourses() {
      this.getCourses(this.getFrom, this.postID)
        .then((response) => {
          this.courses = response.data
        })
        .catch(errorHandler)
    },

    userOwnsPost() {
      const user = this.getUser()
      if (!this.userID) return false

      return user._id === this.userID
    },

    /* ------------------------- EVENT TRIGGERED METHODS ------------------------ */
    addCourseToLocalList() {
      this.courses.push({
        editing: true,
        start: new Date(),
        duration: 60,
        maxAttendees: 3,
        attendees: [],
        _id: null,
        postID: this.postID
      })
    },

    reloadCourseList() {
      this.$forceUpdate()
    },

    removeCourseFromList(course) {
      this.courses.splice(this.courses.indexOf(course), 1)
      this.reloadCourseList()
    },

    onDeleteCoursesPressed() {
      if (confirm('Are you sure you want to delete ALL courses?')) {
        this.courses = []
        this.deleteCourses()
        this.reloadCourseList()
      }
    }
  },
  mixins: [courseController, userController],
  styles: [roundBtnStyle],
  components: {
    CourseView,
    CourseEdit
  },
  props: {
    getFrom: String,
    userID: String,
    postID: String
  }
}
</script>

<style scoped>
.root {
  margin-top: 1.3em;
  text-align: center;
}

.no-courses-container {
  margin: 2em;
}

/* --------------------------- END OF LIST BUTTON --------------------------- */
.button-container {
  border-bottom: 0.1em solid var(--primary-dark);
  max-width: 30em;
  margin: 0 auto 3em auto;
}

.btn-white-block {
  background-color: var(--primary-background);
  width: 5em;
  margin: 0 auto;
  transform: translateY(1.5em);
  display: grid;
}

.courses-action-button {
  color: var(--primary-color);
  border-color: var(--primary-color);
  margin: 0 auto;
  font-weight: 500;
  background-color: var(--soft-white);
}
</style>
