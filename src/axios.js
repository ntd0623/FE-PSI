import axios from "axios";
import _ from "lodash";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    //   withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

instance.interceptors.response.use((response) => {
    const { data } = response;
    return response.data;
});

export default instance;