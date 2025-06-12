
import axios from "../axios";
const getInfoCvStudent = (statusCv = "", batchID = "") => {
    return axios.get(`/api/get-cv?statusCv=${statusCv}&batchID=${batchID}`);
}
const getAllCode = (type) => {
    return axios.get(`/api/get-allCode?type=${type}`)
}
const createCV = (data) => {
    return axios.post(`/api/create-cv`, data)
}
const updateStatusCV = (data) => {
    return axios.put(`/api/update-cv-by-userId`, data)
}
export {
    getInfoCvStudent,
    getAllCode,
    createCV,
    updateStatusCV
}