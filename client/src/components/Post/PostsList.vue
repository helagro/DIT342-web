<template>
  <div>
    <div class="postList">
      <div v-for="(post, index) in posts" :key="index">
        <b-container class="post-container" @click="goToViewPost(post._id)">
          <post :post="post" />
        </b-container>
      </div>
    </div>

    <div v-if="doPaginate" class="pagination">
      <a :href="previous">Previous</a>
      <a :href="next">Next</a>
    </div>
  </div>
</template>

<script>
import { errorHandler } from '@/Api'
import router from '@/router'
import Post from '@/components/Post/PostListItem.vue'
/* ------------------------------- CONTROLLERS ------------------------------ */
import userController from '@/controllers/user'
import postController from '@/controllers/post'

export default {
  components: {
    Post
  },
  data() {
    return {
      posts: [],
      DISPLAY_LIMIT: 16,
      offset: 0,
      next: null,
      previous: null
    }
  },
  mounted() {
    this.offset = this.$route.query.offset || 0
    this.populatePosts()
  },
  methods: {
    populatePosts() {
      const params =
        this.getFrom === 'userPosted' ? { user: this.getUser()._id } : {}
      if (this.doPaginate) {
        params.limit = this.DISPLAY_LIMIT
        params.offset = this.offset
      }

      this.getPosts(params)
        .then((result) => {
          this.posts = result.posts

          // UPDATES PAGINATION LINKS
          this.next = result._links.next?.href
          this.previous = result._links.prev?.href
        })
        .catch((error) => errorHandler(error))
    },
    goToViewPost(index) {
      router.push({ path: `/posts/${index}` })
    }
  },
  props: { getFrom: String, doPaginate: Boolean },
  mixins: [userController, postController]
}
</script>

<style scoped>
.postList {
  margin: 1% auto; /* add horisontal percentage margin */
  padding: 0 1em;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(30em, 40vh), 1fr));
  width: auto;
  row-gap: 1em;
}

@media screen and (max-width: 30em) {
  .postList {
    grid-template-columns: auto;
    padding: 0;
  }

  .post-container {
    padding: 0.3em;
  }
}

/* ------------------------------- PAGINATION ------------------------------- */

.pagination {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto 2em auto;
  width: max-content;
  column-gap: 1em;
}

.pagination a {
  font-size: 1.3em;
  color: var(--primary-dark);
}

.pagination a:not([href]),
.pagination a:not([href]):hover {
  pointer-events: none;
  color: #9b9b9b;
}
</style>
