import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default axios.create({
   baseURL: BACKEND_URL,
});
