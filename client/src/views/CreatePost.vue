<template>
  <div class="box">
    <div class="backgroundImg">
      <b-row>
        <b-col md-4>
          <p>Create Post</p>
        </b-col>
        <b-col md-4>
          <b-card id="backImg"
            :img-src="backgroundImg"
            img-alt="Card Image"
          >
        </b-card>
        </b-col>
      </b-row>
    </div><br/>
    <div class="container md=4 outer-container translate-middle text-center">
      <br/>
        <div class="alert alert-success" v-if="isSuccessful">Post Created Successfully</div>
        <form @submit.prevent="onCreatePost">
          <p v-if="errors.length">
            <b>Please fill in the following required field(s):</b>
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </p>
          <div class="form-group">
                <label class="form-label">Post Name *</label>
                <input type="text" class="form-control" placeholder="E.g: Spagetti" v-model="postName"/>
            </div>
            <div class="form-group">
                <label class="form-label">Cooking Time</label>
                <input type="text" class="form-control" placeholder="E.g: 2hrs" v-model="cookingTime"/>
            </div><br/>
            <div>
              <label class="form-label">Ingredients *</label>
              <div class="form-group" v-for="(input,k) in inputs" :key="k">
                <div class="input-group mb-3">
                  <input type="text" class="form-control text-ingredient" placeholder="Ingredient" aria-label="Ingredient" aria-describedby="basic-addon2" v-model="input.ingredient">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary btn-ingredient" type="button" @click="add(k)" v-show="k == inputs.length-1">
                      <b-icon icon="plus-circle" aria-label="Add"></b-icon>
                    </button>
                  </div>
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary btn-ingredient" type="button" @click="remove(k)" v-show="k || ( !k && inputs.length > 1)">
                      <b-icon icon="trash" aria-label="Remove"></b-icon>
                    </button>
                  </div>
                </div>
              </div><br/>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label> <!--description placeholder generated using chatGPT -->
                <textarea class="form-control" rows="3" v-model="description"
                placeholder="E.g: Indulge your senses in the culinary charm of our Classic Spaghetti Carbonara, a timeless Italian masterpiece that transcends generations.">
              </textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Recipe *</label>
                <textarea class="form-control" rows="3" placeholder="Instructions for the recipe" v-model="recipe"></textarea>
            </div><br/>
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
                <button class="btn btn-submit" type="submit">Create Post</button>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import controller from '@/controllers/post'
// Import FilePond
import vueFilePond from 'vue-filepond'
// Import plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import bImg from '../assets/createPostBackground.png'
// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode
)

export default {
  name: 'createPost',
  data() {
    return {
      postName: '',
      cookingTime: '',
      description: '',
      recipe: '',
      isSuccessful: false,
      inputs: [{
        ingredient: ''
      }],
      postImage: '',
      backgroundImg: bImg,
      errors: []
    }
  },

  methods: {
    checkForm: function () {
      if (this.postName && this.recipe && this.inputs && this.inputs[0].ingredient) {
        return true
      }
      this.errors = []
      if (!this.postName) {
        this.errors.push('Post Name required.')
      }
      if (!this.recipe) {
        this.errors.push('Recipe required.')
      }
      if (!this.inputs || !this.inputs[0].ingredient) {
        this.errors.push('Ingredients required.')
      }
    },
    onCreatePost() {
      if (this.checkForm() === true) {
        const formData = new FormData()
        formData.append('postImage', this.postImage)
        formData.append('postName', this.postName)
        formData.append('description', this.description)
        formData.append('recipe', this.recipe)
        formData.append('cookingTime', this.cookingTime)

        let formDataI = 0
        for (let i = 0; i < this.inputs.length; i++) {
          const ingre = this.inputs[i]
          if (ingre.ingredient !== '') {
            formData.append('ingredients[' + formDataI + ']', JSON.stringify(ingre))
            formDataI++
          }
        }
        this.createPost(formData).then(response => {
          this.isSuccessful = true
          const postId = response.data._id
          router.push({ path: `/posts/${postId}` })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    add() {
      this.inputs.push({
        ingredient: ''
      })
    },
    remove(index) {
      this.inputs.splice(index, 1)
    },
    handleFilePondUpdateFile() {
      this.postImage = this.$refs.pond?.getFile().file
    },
    handleFilePondInit: function () {
      console.log('FilePond has initialized')
    },
    onAddFile(error, file) {
      console.log('file added', { error, file })
    }
  },
  components: {
    FilePond
  },
  mixins: [controller]
}

</script>

<style scoped>
.box {
  background-image: linear-gradient(to bottom left, #ecece9 , rgb(253, 253, 250));
  color: var(--primary-dark);
  margin-bottom: 1%;
}
.outer-container {
  position: relative;
  margin-top: -10%;
  border-radius: 3px;
  font-weight: 600;
  padding: 10%;
  padding-top: 2%;
  margin-bottom: 0%;
  background: rgb(253, 253, 253);
  background-image: linear-gradient(to bottom right, #f8f6f574 , #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 40px 0 rgba(0, 0, 0, 0.19);
  max-width: 55em;
  font-size: 1em;
}
.backgroundImg {
  padding-top: 2%;
  padding-bottom: 6%;
  padding: 2%;
  padding-left: 20%;
  background-image: linear-gradient(to bottom right, #c3edf188 , #b6936c46);
  box-shadow: 0 8px 18px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
#backImg {
  margin-right: 38%;
  padding-bottom: 20%;
  padding-right: 30%;
  background-color: #277c7d00;
  min-width: 9em;
  min-height: 3em;
  max-width: 30em;
  max-height: 20em;
  border: none;
}
.form-group {
  margin-left: 10%;
  margin-right: 10%;
}
.file-pond {
  margin-left: 10%;
  margin-right: 10%;
}
.btn-submit {
  display: inline-block;
  padding: 1% 4%;
  font-size: 1.1em;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: rgb(80, 151, 165);
  border: none;
  border-radius: 5px;
  box-shadow: 0 4px #61a8a95e;
}
.btn-submit:hover {background-color: var(--primary-dark); color: #fff;}

.btn-submit:active {
  background-color: var(--primary-dark);;
  box-shadow: 0 4px #666;
  transform: translateY(4px);
}
.btn-ingredient {
  border-color: var(--primary-dark);
}
.form-control {
  text-align: center;
}
.text-ingredient {
  text-align: center;
}
p {
  padding-top: 10%;
  padding-left: 60%;
  padding: 8%;
  font-size: 2em;
  font-weight: 800;
  color: rgb(181, 92, 25);
  text-shadow: -0.5px 0 black, 0 0.5px rgba(0, 0, 0, 0), 0.5px 0 rgba(0, 0, 0, 0), 0 -0.5px rgba(0, 0, 0, 0.075);
}
@media only screen and (max-width: 48em) {
  p {
    font-size: 1.5em;
  }
}
@media only screen and (max-width: 20.625em) {
  #backImg {
    display: none;
  }
}

</style>
