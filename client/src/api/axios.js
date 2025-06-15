import axios from 'axios';

  const baseURL = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_DEV
    : import.meta.env.VITE_API_URL_PRO;

  console.log('Axios baseURL:', baseURL);

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });


  export default api;