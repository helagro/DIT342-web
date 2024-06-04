<template>
  <PostsList getFrom="every" :doPaginate="true"></PostsList>
</template>

<script>
import PostsList from '@/components/Post/PostsList.vue'

export default {
  components: {
    PostsList
  }
}
</script>
