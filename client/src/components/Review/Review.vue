<template>
  <div class="reviewContainer">
    <CreateReview @createReview="onCreateReview($event)" />
    <ReviewList v-if="postID" :postID="postID" :reviews="reviews" />
  </div>
</template>

<script>
import { errorHandler } from '@/Api'
/* ----------------------- CONTROLLERS ----------------------- */
import reviewController from '@/controllers/review'
import userController from '@/controllers/user'
/* ----------------------- COMPONENTS ----------------------- */
import ReviewList from '@/components/Review/ReviewList.vue'
import CreateReview from '@/components/Review/CreateReview.vue'

export default {
  components: {
    ReviewList,
    CreateReview
  },
  props: {
    postID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reviews: []
    }
  },
  mounted() {
    this.getReviews(this.postID)
      .then((reviews) => {
        this.reviews = reviews
      })
      .catch(errorHandler)
  },
  methods: {
    onCreateReview(review) {
      const username = this.getUser().username
      this.createReview(
        this.$route.params.id,
        username,
        review.rating,
        review.text
      )
        .then(
          this.reviews.unshift({
            username: username,
            rating: review.rating,
            text: review.text
          })
        )
        .catch(errorHandler)
    }
  },
  mixins: [reviewController, userController]
}
</script>

<style scoped>
.reviewContainer {
  max-width: 50em;
  margin: 0 auto;
}
</style>
