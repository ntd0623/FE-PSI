export const path = {
    HOME: "/",
    STUDENT: "/student",
    ADMIN: "/admin",
    CV_MANAGEMENT: "/admin/cv-management",
    FORM_CV: "/student/form-cv",
    PREVIEW_CV: "/student/preview-cv",
    LOGIN: "/login",
    FACEBOOK_CALLBACK: "/facebook-callback",
    REGISTER: "/register",
    UNAUTHORIZED: "/unauthorized",
    PROFILE: "/student/profile",
    ABOUT: "/about",
    MY_CV: "/student/my-cv",
    VIEW_CV: "/student/form-cv/:id",
    QUIZ: "/admin/quiz-management",
    QUIZ_SETS_CREATE: "/admin/quiz/quiz-create/:id",
    QUIZ_CREATE: "/admin/quiz-management/quiz/quiz-create",
    QUIZ_UPDATE: "/admin/quiz/quiz-update/:id",
    QUIZ_REVIEW: "/admin/quiz/:id",
    QUIZ_EVALUATION: "/student/quiz-evaluation/:id",
    QUIZ_LIST_EXAM: "/student/quiz-evaluation",
    STUDENT_SUBMISSTION: "/admin/student-submisstion",
    EIDT_PROFILE: "/student/profile/edit",
    STUDENT_MANAGEMENT: "/admin/student-management",
    CREATE_STUDENT: "/admin/student-management/create",
    UPDATE_STUDENT: "/admin/student-management/update/:id",
    CLASS_MANAGEMENT: "/admin/class-management",
    CREATE_CLASS: "/admin/class-management/create",
    UPDATE_CLASS: "/admin/class-management/update/:id",
    QUIZ_SCHEDULE: "/admin/quiz-management/quiz-schedule",
    CREATE_QUIZ_SCHEDULE: "/admin/quiz-management/quiz-schedule/create",
    UPDATE_QUIZ_SCHEDULE: "/admin/quiz-management/quiz-schedule/update/:id"
}
export const CRUD_ACTIONS = {
    ADD: "ADD",
    EDIT: "EDIT",
    DELETE: "DELETE",
};

export const LANGUAGES = {
    VI: "vi",
    EN: "en",
};

export const USER_ROLE = {
    ADMIN: "R1",
    STUDENT: "R2",
};

export const STATUS_CV = {
    SUBMITTED: "CV1",
    IN_REVIEW: "CV2",
    APPROVED: "CV3",
    REJECT: "CV4"
}

export const STATUS_CV_LABELS = {
    CV1: "Đã nộp",
    CV2: "Đang xem xét",
    CV3: "Đã duyệt",
    CV4: "Từ chối",
};

export const QUESTION_TYPE_MAP = {
    QT1: "Trắc nghiệm - 1 đáp án",
    QT2: "Trắc nghiệm - nhiều đáp án",
    QT3: "Đúng / Sai"
}


export const REVERSE_QUESTION_TYPE_MAP = {
    SINGLE_QUESTION: "QT1",
    MULTIPLE_QUESTION: "QT2",
    TRUE_FALSE: "QT3",
};