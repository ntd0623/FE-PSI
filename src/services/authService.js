import axios from "../axios";

const authService = {
    googleAuth: (token) => {
        return axios.post("/api/auth/google-auth", { token });
    },
    login: (email, password) => {
        return axios.post("/api/login", { email: email, password: password });

    }
};

export default authService;