import { STATUS_CV } from "./constant";
export const getStatusColor = (status) => {
    switch (status) {
        case STATUS_CV.SUBMITTED:
            return "bg-yellow-100 text-yellow-800";
        case STATUS_CV.IN_REVIEW:
            return "bg-blue-100 text-blue-800";
        case STATUS_CV.APPROVED:
            return "bg-green-100 text-green-800";
        case STATUS_CV.REJECT:
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-600";
    }
};