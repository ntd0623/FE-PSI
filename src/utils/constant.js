// Khai báo đường dẫn
export const path = {
    HOME: "/",
    ADMIN: "/admin",
    VIEW: "/view/:id",
    CV_MANAGEMENT: "/cv-management",
    FORM_CV: "/form-cv",
    PREVIEW_CV:"/preview-cv"
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