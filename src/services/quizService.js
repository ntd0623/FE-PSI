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
    },
    getQuestionByQuizID: (id, page = 1, limit = 5) => {
        return axios.get(`/api/get-question-by-quizID?id=${id}&page=${page}&limit=${limit}`)
    },
    deleteQuizSet: (id) => {
        return axios.delete(`/api/delete-quiz-set?id=${id}`)
    }
};

export default quizService;