<template>
  <div>
    <h3>My Posts</h3>
    <div class="postListContainer">
      <PostsList getFrom="userPosted" />
    </div>

    <h3>Attending Courses</h3>
    <Courses getFrom="userAttendance"></Courses>

    <h3>Posted Courses</h3>
    <Courses getFrom="user"></Courses>

    <h3>Credits</h3>
    <b-container>
      <p>
        tableware by James Gordon from
        <a
          href="https://thenounproject.com/browse/icons/term/tableware/"
          target="_blank"
          title="tableware Icons"
          >Noun Project</a
        >
        (CC BY 3.0)
      </p>
      <p>
        <a target="_blank" href="https://icons8.com/icon/20876/pie">Pie</a> icon
        by <a target="_blank" href="https://icons8.com">Icons8</a>
      </p>
    </b-container>
  </div>
</template>

<script>
import Courses from '@/components/Course/Courses.vue'
import PostsList from '@/components/Post/PostsList.vue'

export default {
  components: {
    PostsList,
    Courses
  }
}
</script>

<style scoped>
.postListContainer {
  margin: 0 3%;
}
</style>
