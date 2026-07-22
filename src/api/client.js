import axios from 'axios'

const TOKEN_KEY = "house_hive_access_token";

let accessToken = localStorage.getItem(TOKEN_KEY);

export function setAccessToken(token) {
  accessToken = token;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}


const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, //React app will send and receive the FastAPI JWT cookie
})

api.interceptors.request.use((config) => {
  console.log("REQUEST:", config.url, "TOKEN:", accessToken);
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