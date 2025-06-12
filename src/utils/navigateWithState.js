import { path } from "../utils/constant"
export const navigateToCVPreview = (navigate, cvData) => {
    navigate(path.PREVIEW_CV, { state: cvData });
};