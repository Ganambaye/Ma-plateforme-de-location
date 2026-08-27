import axios from 'axios';
const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' }, timeout: 20000 });

const request = async (config) => {
  const maxRetries = 2;
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await axios(config);
    } catch (err) {
      lastError = err;
      if (err.response?.status && err.response.status !== 502 && err.response.status !== 503 && err.response.status !== 0) {
        throw err;
      }
      if (i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  config.metadata = { retries: 0 };
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.code === 'ECONNABORTED' || (!error.response && error.message !== 'canceled')) {
    return Promise.reject({ ...error, isNetworkError: true });
  }
  if (error.response?.status === 401) { localStorage.removeItem('token'); window.location.href = '/connexion'; }
  return Promise.reject(error);
});

export default api;
