<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="light"
      class="my-navbar navbar-dark bg-dark"
    >
      <b-navbar-brand href="/posts" class="navbar-brand"
        >Recipe4U</b-navbar-brand
      >

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav variant="dark">
        <b-navbar-nav class="navbar-links">
          <b-nav-item href="/posts">Posts</b-nav-item>
          <b-nav-item href="/posts/creation">Create Post</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ getUser().username }}</em>
            </template>

            <b-dropdown-item href="/user">Profile Page</b-dropdown-item>
            <b-dropdown-item href="#" @click="onSignOut()"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import userController from '@/controllers/user'
import authController from '@/controllers/auth'

export default {
  methods: {
    onSignOut() {
      this.signOut()

      this.$router.replace('/')
    }
  },
  mixins: [userController, authController]
}
</script>

<style scoped>
.my-navbar {
  background-color: var(--primary-dark) !important;
}

#nav-collapse {
  color: var(--white) !important;
}

.my-navbar * {
  color: var(--white) !important;
}

.navbar-links {
  margin-left: 1em;
}
</style>
