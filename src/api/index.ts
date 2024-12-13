import axios from 'axios'

const baseURL: string = 'http://localhost:3000/'

export const axiosApiInstance = axios.create({
  baseURL: baseURL,
  paramsSerializer: {
    indexes: null,
  },
})

axiosApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`HTTP Error: ${error.response.status}`)
      console.error(`Message: ${error.response.data.message || 'Unknown error'}`)
    } else {
      console.error('Network Error:', error.message)
    }
    return Promise.reject(error)
  },
)
