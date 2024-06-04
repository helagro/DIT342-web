import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api/v1/'
})

export const errorHandler = (error) => {
  console.error(error?.response?.data)
  alert(error?.response?.data?.message)
}

// Set token in auth headers
export const loadToken = () => {
  Api.defaults.headers.common.Authorization = localStorage.getItem('token')
}

loadToken()
