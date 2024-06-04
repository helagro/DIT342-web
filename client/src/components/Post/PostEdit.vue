<template>
  <b-card no-body class="overflow-hidden outer-box" >
    <b-card class="food-card">
          <b-row class="text-center" align-h="around">
            <b-col md="6">
              <b-card-img id="image" alt="Food Image" :src="imgSRC" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="6">
              <b-card-body class="edit-container">
                <div class="container mb-3">
                  <div class="container"  id="post-title">
                    <h2>Edit {{ value.postName }}</h2>
                  </div>
                  <hr/>
                  <form @submit.prevent="save">
                    <div class="validation-msg">
                        <p v-if="errors.length">
                          <b>Please fill in the following required field(s):</b>
                          <ul>
                            <li v-for="error in errors" :key="error">{{ error }}</li>
                          </ul>
                        </p>
                      </div>
                    <div class="form-group">
                      <label class="form-label">Post Name</label>
                      <input type="text" class="form-control" ref="postNameInput" :value="value.postName" @input="updatePost()"/>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Cooking Time</label>
                      <input type="text" class="form-control" ref="cookingTime" :value="value.cookingTime" @input="updatePost()"/>
                    </div>
                    <div>
                      <label class="form-label">Ingredients</label>
                      <div class="form-group" ref="inputs" :value="value.inputs"  v-for="(input,k) in inputs" :key="k">
                        <div class="input-group mb-3">
                          <input type="text" class="form-control" placeholder="Ingredient" aria-label="Ingredient" aria-describedby="basic-addon2" v-model="input.ingredient">
                          <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click="add(k)" v-show="k == value.ingredients.length-1">
                              <b-icon icon="plus-circle" aria-label="Add"></b-icon>
                            </button>
                          </div>
                          <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click="remove(k)" v-show="k || ( !k && value.ingredients.length > 1)">
                              <b-icon icon="trash" aria-label="Remove"></b-icon>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Description</label>
                      <textarea class="form-control" rows="3" ref="description" :value="value.description" @input="updatePost()"></textarea>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Recipe</label>
                      <textarea class="form-control" rows="3" ref="recipe" :value="value.recipe" @input="updatePost()"></textarea>
                    </div>
                    <file-pond
                      class="file-pond"
                      name="image"
                      ref="pond"
                      class-name="my-pond"
                      label-idle="Drag & Drop your image or Browse"
                      allow-multiple="false"
                      accepted-file-types="image/jpeg, image/png, image/jpg"
                      v-bind:file="postImage"
                      v-on:init="handleFilePondInit"
                      @addfile="onAddFile"
                      v-on:updatefiles="handleFilePondUpdateFile()"
                    /><br/>
                    <div class="form-group">
                      <b-row class="text-center" align-h="center">
                        <b-col md="6" cols="auto" class="pb-2"><b-button variant="outline-info" type="submit">Save Post</b-button></b-col>
                        <b-col md="6" cols="auto" class="pb-2"><b-button variant="outline-secondary" @click="cancel()">Cancel</b-button></b-col>
                      </b-row>
                    </div>
                  </form>
                </div>
              </b-card-body>
            </b-col>
          </b-row>
          </b-card>
    </b-card>
</template>

<script>
import vueFilePond from 'vue-filepond'
// Import plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode
)
export default ({
  props: ['value'],
  data() {
    return {
      isSuccessful: false,
      inputs: [{
        ingredient: ''
      }],
      imgSRC: '',
      postImage: '',
      errors: []
    }
  },
  components: {
    FilePond
  },
  mounted() {
    this.inputs = this.value.ingredients
    this.imgSRC = `http://localhost:3000/api/v1/posts/images/${this.$route.params.id}`
  },
  methods: {
    checkForm: function () {
      if (this.$refs.postNameInput.value && this.$refs.recipe.value && this.inputs && this.inputs[0].ingredient) {
        return true
      }
      this.errors = []
      if (!this.$refs.postNameInput.value) {
        this.errors.push('Post Name required.')
      }
      if (!this.$refs.recipe.value) {
        this.errors.push('Recipe required.')
      }
      if (!this.inputs || !this.inputs[0].ingredient) {
        this.errors.push('Ingredients required.')
      }
    },
    save() {
      if (this.checkForm() === true) {
        const ingredients = this.inputs
        const newImage = this.postImage
        const base64DATA = this.$refs.pond?.getFile()?.getFileEncodeDataURL()
        this.$emit('savePost', {
          postName: this.$refs.postNameInput.value,
          cookingTime: this.$refs.cookingTime.value,
          ingredients,
          description: this.$refs.description.value,
          recipe: this.$refs.recipe.value,
          newImage,
          base64DATA
        })
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    updatePost() {
      this.$emit('input', {
        postName: this.$refs.postNameInput.value,
        cookingTime: this.$refs.cookingTime.value,
        ingredients: this.inputs,
        description: this.$refs.description.value,
        recipe: this.$refs.recipe.value
      })
    },
    add() {
      this.inputs.push({
        ingredient: ''
      })
      console.log('after adding: ' + this.inputs[0].ingredient)
    },
    remove(index) {
      this.inputs.splice(index, 1)
    },
    handleFilePondUpdateFile() {
      this.postImage = this.$refs.pond.getFile().file
      console.log(this.postImage)
    },
    handleFilePondInit: function () {
      console.log('FilePond has initialized')
    },
    onAddFile(error, file) {
      console.log('file added', { error, file })
    }
  }
})
</script>

<style scoped>
.outer-box {
  color: var(--primary-dark);
  background-image: linear-gradient(to bottom left, #f0f0ed , rgb(253, 253, 250));
  position: relative;
  padding: 4%;
  padding-top: 4%;
}
.food-card {
  background-image: linear-gradient(to bottom right, #f8f6f5 , #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 1%;
  border: none;
}
#image {
  position: relative;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.372), 0 16px 20px 0 rgba(0, 0, 0, 0.475);
  border-radius: 2%;
  min-width: 14em;
  min-height: 18em;
  max-width: 30em;
  max-height: 38em;
  margin-top: 4%;
  margin-bottom: 5%;
  margin-left: 8%;
  margin-right: 8%;
}
@media only screen and (max-width: 48em) {
  #image {
    position: relative;
    max-width: 24em;
    max-height: 29em;
    margin-top: -3%;
    margin-right: 11%;
    margin-left: 11%;
  }
}
@media only screen and (max-width: 37.5em) {
  #image {
    position: relative;
    margin-right: 1%;
    margin-left: 1%;
  }
}
.edit-container {
  font-weight: 600;
  margin: 5%;
}
.form-control {
  font-weight: 600;
}
#post-title {
  text-align: center;
}
.validation-msg {
  color: rgb(181, 92, 25);
}
</style>
