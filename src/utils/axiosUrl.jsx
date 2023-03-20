import axios from 'axios';

export default {
    api: axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    }),
};
