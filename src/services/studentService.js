
import axios from "../axios";
const getInfoCvStudent = (statusCv = "", batchID = "", page = 1, limit = 3) => {
    return axios.get(
        `/api/get-cv?statusCv=${statusCv}&batchID=${batchID}&page=${page}&limit=${limit}`
    );
};
const getAllCode = (type) => {
    return axios.get(`/api/get-allCode?type=${type}`)
}
const upsertCV = (data) => {
    return axios.post(`/api/upsert-cv`, data)
}
const updateStatusCV = (data) => {
    return axios.put(`/api/update-cv-by-user-id`, data)
}

const getCVByStudentID = (data) => {
    return axios.get(`/api/get-cv-by-id?id=${data.id}&statusCv=${data.statusCv ? data.statusCv : ""}&page=${data.page ? data.page : 1}&limit=${data.limit ? data.limit : 3}`)
}

const getCV = (data) => {
    return axios.get(`/api/get-cv-by-studentID-and-idCv?studentID=${data.studentID}&cvID=${data.cvID}`)
}

const getAllUser = (current = 1, pageSize = 5, filters = {}) => {
    return axios.get(`/api/get-user?current=${current}&pageSize=${pageSize}`, { params: { ...filters } })
}

const deleteCVStudent = (id) => {
    return axios.delete(`/api/delete-cv?id=${id}`)
}

const getClassForStudent = () => {
    return axios.get(`/api/get-class-for-student`)
}
const createStudent = (data) => {
    return axios.post(`/api/create-student`, data)
}

const importExcel = (data) => {
    return axios.post(`/api/import-students`, data)
}
const getStudentById = (id) => {
    return axios.get(`/api/get-student-by-id?id=${id}`)
}
const updateStudent = (data) => {
    return axios.put(`/api/update-students`, data)
}
const deleteStudent = (id) => {
    return axios.delete(`/api/delete-student?id=${id}`)
}
export {
    getInfoCvStudent,
    getAllCode,
    upsertCV,
    updateStatusCV,
    getCVByStudentID,
    getCV,
    deleteCVStudent,
    getAllUser,
    getClassForStudent,
    createStudent,
    importExcel,
    getStudentById,
    updateStudent,
    deleteStudent
}