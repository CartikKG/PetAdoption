import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://pet-adoption-sand.vercel.app';

export default axios;

