import axios from 'axios'

const baseURL =
  typeof window !== 'undefined' &&
  window.location.hostname === 'localhost'
    ? 'http://192.168.1.109:3333'
    : 'https://aksemijoias-backend.onrender.com'

export const api = axios.create({
  baseURL
})