<template>
  <div class="Wallpaper">
    <div class="Background">
      <div class="center-grid">
        <div class="column-container">
          <h1 class="Header-border">Recipes4U</h1>
          <b-card
            title="Log in"
            style="max-width: 20rem"
            class="login-container md=4 text-center"
          >
            <form class="form-contents" @submit.prevent="logInUser">
              <div class="user-input">
                <span class="input-tag">Username:</span>
                <input type="text" class="textbox" v-model="username" />
              </div>
              <div class="pass-input">
                <span class="input-tag">Password:</span>
                <input type="password" class="textbox" v-model="password" />
              </div>
              <br />
              <div>
                <b-button class="login-btn" type="submit">Log In</b-button>
              </div>
              <p class="card-text">or</p>
              <div>
                <b-button
                  class="register-btn"
                  type="button"
                  @click="goToRegister"
                  >Register</b-button
                >
              </div>
            </form>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/controllers/auth'
import { errorHandler } from '../Api'

export default {
  name: 'Welcome',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async logInUser() {
      try {
        const response = await this.login({
          username: this.username,
          password: this.password
        })

        this.$router.push(response.data._links.homePage.href)
      } catch (error) {
        if (error.response.status === 404) {
          const createAccount = confirm(
            'Invalid credentials. Create an account instead?'
          )

          if (createAccount) {
            const registerPage = error.response.data._links.createUserPage.href
            this.$router.push(registerPage)
          }
        } else {
          errorHandler(error)
        }
      }
    },
    goToRegister() {
      this.$router.push('/register')
    }
  },
  mixins: [auth]
}
</script>

<style scoped>
.Header-border {
  color: #005900;
  text-shadow: #fffca8 2px 2px 0px, #9c9c9c 4px 4px 0px;
  font-weight: bold;
  flex-direction: column;
  font-size: 50px;
  background-color: white;
}
.center-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
}
.column-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30%;
}
.login-container {
  align-items: center;
  margin-top: 10%;
  padding: 1%;
  background-image: linear-gradient(to bottom right, #f8f6f5, #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 1%;
  border: none;
}
.login-btn {
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
.login-btn:hover {
  background-color: var(--primary-dark);
  color: #fff;
}
.login-btn:active {
  background-color: var(--primary-dark);
  box-shadow: 0 4px #666;
  transform: translateY(4px);
}
.register-btn {
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
.register-btn:hover {
  background-color: var(--primary-dark);
  color: #fff;
}
.register-btn:active {
  background-color: var(--primary-dark);
  box-shadow: 0 4px #666;
  transform: translateY(4px);
}
.card-text {
  margin-top: 5%;
}
.form-contents {
  margin-left: 15%;
  margin-right: 15%;
}

.Wallpaper {
  /* Image used from freepik.com */
  background-image: url('https://img.freepik.com/premium-vector/seamless-pattern-with-vegetarian-food_73378-545.jpg?w=1060');
  min-height: 100vh;
  min-width: 100vw;
}
</style>
