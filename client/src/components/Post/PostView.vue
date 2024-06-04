<template>
  <div class="outer-container">
    <div style="padding-top: 3%">
      <b-card no-body class="food-card">
        <b-row no-gutters>
          <b-col md="4">
            <b-card-img
              id="image"
              alt="Food Image"
              :src="this.imageFileBase64 || imgSRC"
              class="image-box"
            ></b-card-img>
          </b-col>
          <b-col md="6">
            <b-card-body class="text-part" :title="post.postName">
              <b-card-text>
                {{ descriptionContent }}
              </b-card-text>
              <div v-if="isPostOwner()">
                <b-button
                  class="btn-edit"
                  @click="goToEditPostPage()"
                  variant="info"
                  >Edit</b-button
                >
              </div>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
      <div>
        <b-jumbotron
          class="recipe-box"
          bg-variant="light"
          text-variant="dark"
          border-variant="light"
        >
          <h3>Recipe</h3>
          <h4><img :src="ingredientsIcon" /> Ingredients:</h4>
          <div class="ingredients-list">
            <ul v-for="ingre in ingres" :key="ingre">
              <li>
                <span>{{ ingre + '\n' }}</span>
              </li>
            </ul>
          </div>
          <hr class="my-4" />
          <h5><img :src="timerIcon" /> Cooking time:</h5>
          <p>{{ post.cookingTime }}</p>
          <hr class="my-4" />
          <div>
            <h4>Recipe: <img class="cooking-book" :src="cookingBookIcon" /></h4>
            <br />
            <p>
              {{ post.recipe }}
            </p>
          </div>
        </b-jumbotron>
      </div>

      <b-tabs>
        <b-tab title="Courses" title-link-class="tabview-tab-link">
          <Courses
            v-if="postID"
            :postID="postID"
            getFrom="post"
            :userID="post.user"
          ></Courses>
        </b-tab>

        <b-tab title="Reviews" title-link-class="tabview-tab-link">
          <Review :postID="postID" />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { errorHandler } from '@/Api'
/* ------------------------------- CONTROLLERS ------------------------------ */
import userController from '@/controllers/user.js'
import postController from '@/controllers/post.js'
/* ------------------------------- COMPONENTS ------------------------------- */
import Courses from '@/components/Course/Courses.vue'
import Review from '@/components/Review/Review.vue'
/* --------------------------------- ICONS --------------------------------- */
import ingredientsIcon from '@/assets/Ingredients.png'
import cookingBookIcon from '@/assets/Cooking Book.png'
import timerIcon from '@/assets/Timer.png'

export default {
  name: 'viewPost',
  props: ['imageFileBase64'],
  data() {
    return {
      post: '',
      postID: '',
      ingres: [],
      imgSRC: '',
      inputs: [
        {
          ingredient: ''
        }
      ],
      editedPost: {
        postName: null,
        cookingTime: null,
        ingredients: null,
        description: null,
        recipe: null
      },
      ingredientsIcon: '',
      cookingBookIcon: '',
      timerIcon: '',
      imgFile: null
    }
  },
  created() {
    this.populatePost()
    this.ingredientsIcon = ingredientsIcon
    this.cookingBookIcon = cookingBookIcon
    this.timerIcon = timerIcon
    this.imgFile = this.imageFileBase64
  },
  computed: {
    descriptionContent: function () {
      if (!this.post.description) {
        return 'No Description'
      } else {
        return this.post.description
      }
    }
  },
  methods: {
    populatePost() {
      this.postID = this.$route.params.id
      this.getPost(this.postID)
        .then((post) => {
          this.post = post
          this.imgSRC = `http://localhost:3000/api/v1/posts/images/${this.postID}`
          for (let i = 0; i < post.ingredients.length; i++) {
            if (!post.ingredients[i]) continue
            const ingre = JSON.parse(post.ingredients[i]).ingredient
            this.ingres[i] = ingre
            if (this.inputs[0].ingredient === '') {
              this.inputs[0].ingredient = ingre
            } else {
              this.inputs.push({ ingredient: ingre })
            }
          }
        })
        .catch((error) => errorHandler(error))
    },
    isPostOwner() {
      const user = this.getUser()
      if (user._id === this.post.user) {
        return true
      }
      return false
    },
    goToEditPostPage() {
      const ingredients = []
      for (let i = 0; i < this.inputs.length; i++) {
        const ingre = this.inputs[i].ingredient
        ingredients.push({ ingredient: ingre })
      }
      this.$emit('edit', {
        postName: this.post.postName,
        cookingTime: this.post.cookingTime,
        description: this.post.description,
        recipe: this.post.recipe,
        ingredients
      })
    }
  },
  mixins: [userController, postController],
  components: {
    Courses,
    Review
  }
}
</script>

<style scoped>
.outer-container {
  background-color: #f5f3f0;
  padding: 3%;
}
.food-card {
  background-image: linear-gradient(to bottom right, #f8f6f5, #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 1%;
  border: none;
}
#image {
  position: relative;
  margin-top: -10%;
  margin-bottom: 15%;
  margin-left: 45%;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 2%;
  min-width: 14em;
  min-height: 18em;
  max-width: 20em;
  max-height: 28em;
}
@media only screen and (max-width: 48rem) {
  #image {
    position: relative;
    max-width: 14em;
    max-height: 19em;
    margin-top: -3%;
    margin-bottom: 0;
    margin-left: 15%;
  }
  .text-part {
    padding-right: 10%;
  }
}
.text-part {
  padding-left: 40%;
  font-size: large;
  color: rgb(181, 92, 25);
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;
}
.recipe-box {
  background-image: linear-gradient(
    to bottom right,
    #f8f6f5,
    rgb(245, 243, 240)
  );
}
h4 {
  margin-top: 2%;
}
ul {
  list-style: none;
}
ul li:before {
  content: '•';
  font-size: 170%;
  padding-right: 1em;
}
li {
  color: var(--primary-dark);
}
li span {
  color: black;
}
.ingredients-list {
  font-size: 1.2em;
}
p {
  font-size: large;
}
.btn-edit {
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
  box-shadow: 0 4px #338f8919;
}
.btn-edit:hover {
  background-color: var(--primary-dark);
  color: #fff;
}

.btn-edit:active {
  background-color: var(--primary-dark);
  box-shadow: 0 4px #666;
  transform: translateY(4px);
}
.scroll-container {
  height: 31.25rem;
  overflow-y: scroll;
  border: 1px solid;
}
</style>

<style>
.tabview-tab-link {
  color: var(--primary-dark) !important;
}
</style>
