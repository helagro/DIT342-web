<template>
  <div id="app">
    <div id="nav" v-if="showNavBar()">
      <navbar></navbar>
    </div>

    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import userController from './controllers/user.js'

export default {
  mounted() {
    // Redirects to login page if not logged in
    if (!this.getUser() && this.$route.path !== '/') {
      this.$router.push('/')
    }
  },
  methods: {
    showNavBar() {
      const path = this.$route.path

      return !(path === '/' || path === '/register')
    }
  },
  components: {
    Navbar
  },
  mixins: [userController]
}
</script>

<style>
:root {
  --primary-color: #eb6a1a;
  --primary-dark: #277c7d;
  --primary-background: #f5f3f0;
  --soft-white: #fffefe;
}

body {
  background-color: var(--primary-background) !important;
}

#app {
  background-color: var(--primary-background);
}

/* ---------------------------------- TEXT ---------------------------------- */

h3 {
  color: rgb(68, 67, 67);
  font-size: 3em;
  box-shadow: 10px 10px 5px #277c7d2b;
  box-decoration-break: slice;
  padding: 1%;
  margin: 1%;
  font-weight: 300;
}

h3::first-letter {
  color: var(--primary-dark);
  font-size: 123%;
}
</style>
