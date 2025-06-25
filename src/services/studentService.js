
import axios from "../axios";
const getInfoCvStudent = (statusCv = "", batchID = "", page = 1, limit = 3) => {
    return axios.get(
        `/api/get-cv?statusCv=${statusCv}&batchID=${batchID}&page=${page}&limit=${limit}`
    );
};
const getAllCode = (type) => {
    return axios.get(`/api/get-allCode?type=${type}`)
}
const createCV = (data) => {
    return axios.post(`/api/create-cv`, data)
}
const updateStatusCV = (data) => {
    return axios.put(`/api/update-cv-by-userId`, data)
}

const getCVByStudentID = (data) => {
    return axios.get(`/api/get-cv-by-id?id=${data.id}&statusCv=${data.statusCv ? data.statusCv : ""}&page=${data.page ? data.page : 1},&litmit=${data.limit ? data.limit : 3}`)
}

const getCV = (data) => {
    return axios.get(`/api/get-cv-by-studentID-and-idCv?studentID=${data.studentID}&cvID=${data.cvID}`)
}

export {
    getInfoCvStudent,
    getAllCode,
    createCV,
    updateStatusCV,
    getCVByStudentID,
    getCV
}