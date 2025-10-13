import { get } from "lodash";
import axios from "../axios";

const classService = {
    createClass: (data) => {
        return axios.post("/api/create-class", data);
    },
    getAllClasses: (current = 1, pageSize = 5) => {
        return axios.get(`/api/get-classes?current=${current}&pageSize=${pageSize}`);
    },
    getClassById: (id) => {
        return axios.get(`/api/get-class-by-id?id=${id}`);
    },
    updateClass: (data) => {
        return axios.put("/api/update-class", data);
    },
    deleteClass: (id) => {
        return axios.delete(`/api/delete-class?id=${id}`);
    }
};

export default classService;