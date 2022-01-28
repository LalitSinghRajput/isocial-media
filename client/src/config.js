import axios from 'axios';

export const axiosInstance = axios.create({
    // baseURL: "https://isocial-media.herokuapp.com/api/"
    baseURL: "http://localhost:8000/api/"
})