
import axios from "../axios";
const getInfoCvStudent = () => {
    return axios.get(`/api/get-list-student`);
}
const getAllCode = (type) => {
    return axios.get(`/api/get-allCode?type=${type}`)
}
const createCV = (data) => {
    return axios.post(`/api/create-cv`, data)
}
export {
    getInfoCvStudent,
    getAllCode,
    createCV
}