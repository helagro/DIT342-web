<template>
  <div>
    <div class="alert alert-success" v-if="isSuccessful">
      Post Edited Successfully
    </div>
    <div v-if="isEditingModeOn == false">
      <post-view
        v-on:edit="edit($event)"
        :imageFileBase64="imageFileBase64"
      ></post-view>
    </div>
    <div v-else>
      <post-edit
        v-model="editedPost"
        v-on:savePost="onUpdatePost($event)"
        v-on:cancel="cancel()"
      ></post-edit>
    </div>
  </div>
</template>

<script>
import PostEdit from '../components/Post/PostEdit.vue'
import PostView from '../components/Post/PostView.vue'
import controller from '@/controllers/post'

export default {
  name: 'postManager',
  data() {
    return {
      isSuccessful: false,
      isEditingModeOn: false,
      editedPost: {
        postName: null,
        cookingTime: null,
        ingredients: null,
        description: null,
        recipe: null
      },
      imageFileBase64: null
    }
  },
  methods: {
    edit(post) {
      this.isEditingModeOn = true
      this.populateEditPost(post)
    },
    populateEditPost(post) {
      this.editedPost.postName = post.postName
      this.editedPost.cookingTime = post.cookingTime
      this.editedPost.description = post.description
      this.editedPost.recipe = post.recipe
      this.editedPost.ingredients = []

      for (let i = 0; i < post.ingredients.length; i++) {
        const ingre = post.ingredients[i].ingredient
        this.editedPost.ingredients.push({ ingredient: ingre })
      }
    },
    onUpdatePost(updatedPost) {
      this.imageFileBase64 = updatedPost.base64DATA

      /* -------------------- CREATE FORM DATA -------------------- */
      const formData = new FormData()
      formData.append('postName', updatedPost.postName)
      formData.append('description', updatedPost.description)
      formData.append('recipe', updatedPost.recipe)
      formData.append('cookingTime', updatedPost.cookingTime)
      formData.append('postImage', updatedPost.newImage)
      // INGREDIENTS
      for (let i = 0; i < updatedPost.ingredients.length; i++) {
        const ingre = updatedPost.ingredients[i]
        formData.append('ingredients[' + i + ']', JSON.stringify(ingre))
      }

      /* -------------------- UPDATE ON SERVER -------------------- */
      this.updatePost(this.$route.params.id, formData)
        .then((_) => {
          this.isSuccessful = true
          setTimeout(() => {
            this.isSuccessful = false
          }, 1000)
        })
        .catch((error) => {
          console.log(error)
        })
      this.isEditingModeOn = false
    },
    cancel() {
      this.isEditingModeOn = false
    }
  },
  components: {
    PostEdit,
    PostView
  },
  mixins: [controller]
}
</script>
