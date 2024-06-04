<template>
  <b-card class="review-container">
    <form class="form-content" @submit.prevent="submitReview">
      <div class="review-text-input">
        <span class="input-tag">Leave a review</span>
        <input
          type="text"
          class="text-textbox"
          placeholder="E.g: Good food!"
          v-model="text"
        />
      </div>
      <div class="rating-input">
        <span class="input-tag">Rate this receipe out of 5</span>
        <input
          type="number"
          class="rate-textbox"
          v-model="rating"
          @input="isRatingValid"
        />
      </div>
      <div class="Error-Message">
        <div v-if="errorMessage" class="error-text">
          {{ this.errorMessage }}*
        </div>
      </div>
      <div class="submit-review-btn">
        <button type="submit" class="submit-btn">Submit</button>
      </div>
    </form>
  </b-card>
</template>
<script>
/* ------------------------------- CONTROLLERS ------------------------------ */
import userController from '@/controllers/user'
import reviewController from '@/controllers/review'

export default {
  mixins: [userController, reviewController],
  name: 'CreateReview',
  data() {
    return {
      rating: 1,
      text: '',
      errorMessage: ''
    }
  },
  methods: {
    isRatingValid() {
      // Ensures that the rating input is between 0 and 5
      const inputRating = parseFloat(this.rating)
      if (inputRating < 1 || inputRating > 5) {
        this.rating = 1
      }
    },

    async submitReview() {
      if (this.text === '') {
        this.errorMessage = 'Missing parameters'
      } else {
        this.errorMessage = ''
        this.$emit('createReview', {
          rating: this.rating,
          text: this.text
        })
        this.text = ''
      }
    }
  }
}
</script>

<style scoped>
.review-container {
  max-width: 20em;
  align-items: center;
  margin: 1% auto;
  background-image: linear-gradient(to bottom right, #f8f6f5, #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.review-container * {
  color: var(--primary-dark);
}

.review-container input[type='text'] {
  background-color: var(--soft-white);
}

.submit-review-btn {
  margin-top: 3%;
  margin-left: 22%;
}
.submit-btn {
  background-color: var(--soft-white);
  color: var(--primary-dark);
  padding: 0.3em 1.8em;
  border: 0.1em solid var(--primary-dark);
}
.input-tag {
  margin-left: 10%;
  color: rgb(36, 124, 125);
}
.text-textbox {
  margin-left: 10%;
}
.rate-textbox {
  margin-left: 10%;
}
.form-content {
  margin-left: 5%;
}
.error-text {
  color: red;
}
</style>
