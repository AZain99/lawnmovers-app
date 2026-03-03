import axios from 'axios';
import { getAuth } from 'firebase/auth';

const adminApi = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL || 'http://localhost:3000/api'
});

adminApi.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;