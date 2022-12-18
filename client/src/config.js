import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://busy-red-goat-boot.cyclic.app/api/",
    // baseURL: "http://localhost:8000/api/",
})