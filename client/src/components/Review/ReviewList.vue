<template>
  <div class="review-container">
    <div class="comment-box" v-for="(review, index) in reviews" :key="index">
      <div class="user-rating">
        <span class="User">{{ review.username }} </span>
        <span class="Rate">{{ populateRating(review.rating) }}</span>
      </div>
      <p class="Comment">{{ review.text }}</p>
    </div>
  </div>
</template>

<script>
import reviewController from '@/controllers/review'

export default {
  name: 'Reviews',
  methods: {
    populateRating(rating) {
      let stars = ''
      let emptyStars = ''
      const emptyStarCount = 5 - rating
      if (emptyStarCount === 0) {
        for (let i = 0; i < rating; i++) {
          stars = stars + '\u2B50'
        }
        return stars
      } else {
        for (let i = 0; i < rating; i++) {
          stars = stars + '\u2B50'
        }
        for (let i = 0; i < emptyStarCount; i++) {
          emptyStars = emptyStars + '\u2606'
        }
        return stars + emptyStars
      }
    }
  },
  props: {
    postID: {
      type: String,
      required: true
    },
    reviews: {
      type: Array,
      required: true
    }
  },
  mixins: [reviewController]
}
</script>

<style scoped>
.review-container {
  background-color: var(--primary-background);
}

.comment-box {
  border: 1px solid white;
  padding: 10px;
  white-space: pre-line;
  background-image: linear-gradient(to bottom right, #f8f6f5, #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 1%;
  border: none;
  margin: 10px;
}

.User {
  font-weight: bold;
}
</style>
