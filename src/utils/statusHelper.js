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

export const getAvatarColor = (name) => {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-yellow-500",
    ];
    const charSum = name
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
}