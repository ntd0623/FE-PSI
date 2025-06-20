import axios from "../axios";

const authService = {
    googleAuth: (token) => {
        return axios.post("/api/auth/google-auth", { token });
    },
    login: (email, password) => {
        return axios.post("/api/login", { email: email, password: password });

    },
    facebookAuth: (access_token) => {
        return axios.post("/api/auth/facebook", { access_token });

    },
    register: (data) => {
        return axios.post("/api/register", data);

    }
};

export default authService;