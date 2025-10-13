import axios from "../axios";

const scheduleService = {
    createSchedule: (data) => {
        return axios.post("/api/create-schedule", data);
    },
    updateSchedule: (data) => {
        return axios.put("/api/update-schedule", data);
    },
    getSchedule: (current = 1, pageSize = 5, sort = "lastest") => {
        return axios.get(`/api/get-schedule?current=${current}&pageSize=${pageSize}&sort=${sort}`)
    },
    getScheduleById: (id) => {
        return axios.get(`/api/get-schedule-by-id?id=${id}`)
    },
    getScheduleByExamCode: (exam_code, id) => {
        return axios.get(`/api/get-schedule-by-exam-code?exam_code=${exam_code}&user=${id}`)
    },
    deleteSchedule: (id) => {
        return axios.delete(`/api/delete-schedule?id=${id}`)
    }
};

export default scheduleService;