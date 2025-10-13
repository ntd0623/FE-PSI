import axios from "../axios";

const examService = {
    createExam: (data) => {
        return axios.post("/api/create-attempt", data);
    },
    getAttempt: (schedule_id, attempt_id) => {
        return axios.get(`/api/get-attempt?schedule_id=${schedule_id}&attempt_id=${attempt_id}`);
    },
    autoSave: (data) => {
        return axios.post("/api/auto-save-attempt", data);
    },
    submitAttempt: (data) => {
        return axios.post("/api/submit-attempt", data);
    },
    getResultAttempt: (page = 1, pageSize = 5, filters = {}) => {
        return axios.get(`/api/get-result-attempt?current=${page}&pageSize=${pageSize}`, { params: filters });
    },
    getAllQuiz: () => {
        return axios.get("/api/get-all-quiz");
    },
    exportResult: (classes, quiz) => {
        return axios.get(`/api/export-result?classes=${classes}&quiz=${quiz}`)
    }
};

export default examService;