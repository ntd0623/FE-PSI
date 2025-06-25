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


export const statusStyle = (status) => {
    switch (status) {
        case STATUS_CV.SUBMITTED:
            return {
                bg: "bg-gradient-to-r from-blue-100 to-blue-50",
                text: "text-blue-800",
                border: "border-blue-200",
                icon: "📤",
            };
        case STATUS_CV.IN_REVIEW:
            return {
                bg: "bg-gradient-to-r from-yellow-100 to-yellow-50",
                text: "text-yellow-800",
                border: "border-yellow-200",
                icon: "🕐",
            };
        case STATUS_CV.APPROVED:
            return {
                bg: "bg-gradient-to-r from-green-100 to-green-50",
                text: "text-green-800",
                border: "border-green-200",
                icon: "✅",
            };
        case STATUS_CV.REJECT:
            return {
                bg: "bg-gradient-to-r from-red-100 to-red-50",
                text: "text-red-800",
                border: "border-red-200",
                icon: "❌",
            };
        default:
            return {
                text: "text-gray-600",
                bg: "bg-gray-100",
                border: "border-gray-300",
                icon: "📄",
            };
    }
};