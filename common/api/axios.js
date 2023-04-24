import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;
axios.defaults.withCredentials = true;
export default axios.create({
    baseURL: BASE_URL,
    credentials: 'include',
    withCredentials: 'true'
});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});