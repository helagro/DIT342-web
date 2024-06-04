import { Api, loadToken } from '@/Api'
import userController from '@/controllers/user'

async function login(credentials) {
  const response = await Api.post('login', credentials)
  localStorage.setItem('token', 'Bearer ' + response.data.jwt)
  loadToken()
  await this.loadUser()

  return response
}

function signOut() {
  localStorage.removeItem('token')
  loadToken()
  this.removeUserFromStorage()
}

export default {
  methods: {
    login,
    signOut
  },
  mixins: [userController]
}
