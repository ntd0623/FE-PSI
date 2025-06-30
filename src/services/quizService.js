import axios from "../axios";

const quizService = {
    getQuizSets: () => {
        return axios.get("/api/get-quiz-set");
    },
    getQuizSetsByID: (id) => {
        return axios.get(`/api/get-quiz-set-by-id?id=${id}`)
    },
    upsertQuizSets: (data) => {
        return axios.post(`/api/upsert-quiz-set`, data)
    }
};

export default quizService;