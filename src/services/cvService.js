import axios from "../axios";

const getListCv = () => {
    return axios.get(`/api/get-cv`);
}

export {
    getListCv
}