<template>
  <div>
    <b-card
      :title="truncatedPostName"
      :img-src="`http://localhost:3000/api/v1/posts/images/${post._id}`"
      img-alt="Food Image"
      img-top
      tag="article"
      class="mb-2 post-card"
    >
      <b-card-text>
        {{ truncatedDescription }}
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'post',
  props: ['post'],
  computed: {
    truncatedPostName: function () {
      if (this.post.postName.length < 18) {
        return this.post.postName
      }
      return this.post.postName.substring(0, 18) + '..'
    },
    truncatedDescription: function () {
      if (!this.post.description) {
        return 'No Description'
      } else if (this.post.description.length < 20) {
        return this.post.description
      } else {
        return this.post.description.substring(0, 20) + '..'
      }
    }
  }
}
</script>

<style scoped>
.post-card {
  border-radius: 0.5em;
  overflow: hidden;
  color: var(--primary-dark);
  box-shadow: 0.015em 0.015em 0.1em #838383dd;
  transition: box-shadow 0.2s;
  background-color: var(--soft-white);
}

.post-card:hover {
  box-shadow: 0.09em 0.09em 0.23em #838383dd;
}

.post-card img {
  object-fit: cover;
  height: 40vh;
  max-height: 10em;
  text-align: center;
  line-height: min(40vh, 10em);
  font-size: 3em;
  background-color: #dfdfdf;
}

.post-card p {
  color: #1c1c1c;
}
</style>
