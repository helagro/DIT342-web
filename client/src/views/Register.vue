<template>
  <div class="Wallpaper">
    <div class="Background">
      <div class="center-grid">
        <div class="column-container">
          <b-card
            title="Register"
            style="max-width: 20rem"
            class="register-container md=4 text-center"
          >
            <form class="form-contents" @submit.prevent="registerUser">
              <div class="Fname-input">
                <span class="input-tag">First Name:</span>
                <input
                  type="text"
                  class="textbox"
                  placeholder="E.g: Peter"
                  v-model="firstName"
                />
              </div>

              <div class="Lname-input">
                <span class="input-tag">Last Name:</span>
                <input
                  type="text"
                  class="textbox"
                  placeholder="E.g: Andersson"
                  v-model="lastName"
                />
              </div>
              <div class="Age-input">
                <span class="input-tag">Your age:</span>
                <input
                  type="Number"
                  class="textbox"
                  placeholder="E.g: 20"
                  v-model="age"
                />
              </div>
              <div class="email-input">
                <span class="input-tag">Email address*:</span>
                <input
                  type="text"
                  class="textbox"
                  placeholder="E.g: something@gmail.com"
                  v-model="email"
                />
              </div>

              <div class="user-input">
                <span class="input-tag">Username*:</span>
                <input
                  type="text"
                  class="textbox"
                  placeholder="E.g: user200"
                  v-model="username"
                />
              </div>

              <div class="pass-input">
                <span class="input-tag">Password*:</span>
                <input type="password" class="textbox" v-model="password" />
              </div>
              <div class="pass-input">
                <span class="input-tag">Re-enter Password*:</span>
                <input type="password" class="textbox" v-model="redoPass" />
              </div>
              <div class="Error-Message">
                <div v-if="errorMessage" class="error-text">
                  {{ this.errorMessage }}*
                </div>
              </div>
              <br />
              <div>
                <b-button class="register-btn" type="submit">Register</b-button>
              </div>
            </form>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import controller from '@/controllers/user'

export default {
  name: 'Register',
  mixins: [controller],
  data() {
    return {
      username: '',
      password: '',
      redoPass: '',
      email: '',
      firstName: '',
      lastName: '',
      age: '',
      errorMessage: ''
    }
  },
  methods: {
    async registerUser() {
      try {
        if (this.redoPass !== this.password) {
          this.errorMessage =
            'The passwords do not match, please reenter the passwords correctly'
          this.password = ''
          this.redoPass = ''
        } else if (
          this.username === '' ||
          this.password === '' ||
          this.redoPass === '' ||
          this.email === ''
        ) {
          const error = new Error('Missing parameters')
          error.response = {
            status: 422
          }
          throw error
        } else {
          await this.createUser(
            this.username,
            this.password,
            this.email,
            this.firstName,
            this.lastName,
            this.age
          )
          const redirect = confirm(
            'Account created! Would you like to go to the login?'
          )
          if (redirect) {
            this.$router.push('/')
          }
        }
      } catch (error) {
        if (error.response.status === 403) {
          this.errorMessage = 'Username is taken'
        }
        if (error.response.status === 422) {
          this.errorMessage = 'Missing parameters'
        }
        if (error.response.status === 500) {
          this.errorMessage = 'Failed to create an account'
        } else {
          console.log(error)
        }
      }
    }
  }
}
</script>

<style scoped>
.Background {
  color: rgb(36, 124, 125);
  padding: 3%;
}
.center-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  height: min-content;
  margin-top: 5em;
}
.Header-border {
  color: #005900;
  text-shadow: #fffca8 2px 2px 0px, #9c9c9c 4px 4px 0px;
  font-weight: bolder;
  background-color: white;
  text-align: center;
}
.column-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register-container {
  align-items: center;
  margin-top: 0%;
  margin-left: 2%;
  margin-bottom: 2%;
  padding: 1%;
  background-image: linear-gradient(to bottom right, #f8f6f5, #277c7d6e);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 1%;
  border: none;
}
.form-contents {
  margin-left: 15%;
  margin-right: 15%;
}
.error-text {
  color: red;
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
.Wallpaper {
  /* Image used from freepik.com */
  background-image: url('https://img.freepik.com/premium-vector/seamless-pattern-with-vegetarian-food_73378-545.jpg?w=1060');
  min-height: 100vh;
  min-width: 100vw;
}
</style>
