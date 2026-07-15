import axios from 'axios'

let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, //React app will send and receive the FastAPI JWT cookie
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const detail = error.response?.data?.detail
    const message = detail ?? 'Request failed'
    const err = new Error(typeof message === 'string' ? message : JSON.stringify(message))
    err.status = error.response?.status
    return Promise.reject(err)
  },
)

export default api