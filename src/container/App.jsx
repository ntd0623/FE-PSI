import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import CVManagement from "./System/CvManagement";
import CVManagementSystem from "./System/CVManagementSystem";
import FormCV from "./FormCV/FormCV";
import PreviewCV from "./FormCV/PreviewCV";
import { path, USER_ROLE } from "../utils/constant";
import "../styles/tailwind.css";
import "../styles/index.scss";
import "../styles/nprogress.css";
import toast, { Toaster } from "react-hot-toast";
import Login from "./Auth/Login";
import FacebookCallback from "./components/Facebook/FacebookCallback";
import Register from "./Auth/Register/Register";
import Unauthorized from "./components/ProtectedRoute/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomePage from "./Home/HomePage";
import Profile from "./Home/Profile/Profile";
import MyCV from "./FormCV/MyCV";
import StudentLayout from "./Home/HomeHeader/StudentLayout";
import QuizManagement from "./System/Quiz/QuizManagement";
import QuizCreate from "./System/Quiz/QuizCreate";
import UpdateCV from "./FormCV/UpdateCV";
import QuizUpdate from "./System/Quiz/QuizUpdate";
import QuizReview from "./System/Quiz/QuizReview";
import CandidateEvaluationQuiz from "./Home/Exam/CandidateEvaluationQuiz";
import QuizListExam from "./Home/Exam/QuizListExam";
import StudentSubmissions from "./System/Quiz/StudentSubmisstion";
import AboutPage from "./Home/About/AboutPage";
import NotFound from "./components/ProtectedRoute/NotFound";
import EditProfile from "./Home/Profile/EditProfile";
import QuizSchedules from "./System/Quiz/Schedule/QuizSchedule";
import QuizScheduleForm from "./System/Quiz/Schedule/CreateScheduleQuiz";
import UpdateQuizSchedule from "./System/Quiz/Schedule/UpdateSchedule";
import ClassManagement from "./System/Class/ClassManagement";
import ClassForm from "./System/Class/CreateClass";
import ClassUpdate from "./System/Class/UpdateClass";
import StudentManagement from "./System/Student/StudentManagent";
import StudentForm from "./System/Student/CreateStudent";
import StudentUpdateForm from "./System/Student/UpdateStudent";
export default function App() {
  return (
    <>
      <Routes>
        <Route path={path.HOME} element={<HomePage />} /> {/* ROUTE LOGIN */}
        <Route path={path.LOGIN} element={<Login />} />{" "}
        <Route path={path.ABOUT} element={<AboutPage />} />{" "}
        {/* ROUTE REGISTER */}
        <Route path={path.REGISTER} element={<Register />} />{" "}
        {/* Protected route Admin */}
        <Route
          path={path.ADMIN}
          element={<ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]} />}
        >
          {/* HEADER AND SIDEBAR */}
          <Route element={<CVManagementSystem />}>
            <Route index element={<CVManagement />} />
            <Route path={path.CV_MANAGEMENT} element={<CVManagement />} />
            <Route path={path.QUIZ} element={<QuizManagement />} />
            <Route path={path.QUIZ_SETS_CREATE} element={<QuizCreate />} />
            <Route path={path.QUIZ_CREATE} element={<QuizCreate />} />
            <Route path={path.QUIZ_UPDATE} element={<QuizUpdate />} />
            <Route path={path.QUIZ_REVIEW} element={<QuizReview />} />
            <Route path={path.QUIZ_SCHEDULE} element={<QuizSchedules />} />
            <Route path={path.CLASS_MANAGEMENT} element={<ClassManagement />} />
            <Route path={path.CREATE_CLASS} element={<ClassForm />} />
            <Route path={path.UPDATE_CLASS} element={<ClassUpdate />} />
            <Route
              path={path.STUDENT_MANAGEMENT}
              element={<StudentManagement />}
            />
            <Route path={path.CREATE_STUDENT} element={<StudentForm />} />
            <Route path={path.UPDATE_STUDENT} element={<StudentUpdateForm />} />
            <Route
              path={path.UPDATE_QUIZ_SCHEDULE}
              element={<UpdateQuizSchedule />}
            />
            <Route
              path={path.CREATE_QUIZ_SCHEDULE}
              element={<QuizScheduleForm />}
            />
            <Route
              path={path.STUDENT_SUBMISSTION}
              element={<StudentSubmissions />}
            />
          </Route>
        </Route>
        {/* Protected Route Student */}
        <Route
          path={path.STUDENT}
          element={<ProtectedRoute allowedRoles={[USER_ROLE.STUDENT]} />}
        >
          {/* HEADER */}
          <Route element={<StudentLayout />}>
            <Route path={path.FORM_CV} element={<FormCV />} />{" "}
            <Route path={path.MY_CV} element={<MyCV />} />{" "}
            <Route path={path.PROFILE} element={<Profile />} />{" "}
            <Route path={path.EIDT_PROFILE} element={<EditProfile />} />{" "}
            <Route path={path.VIEW_CV} element={<UpdateCV />} />{" "}
            <Route
              path={path.QUIZ_EVALUATION}
              element={<CandidateEvaluationQuiz />}
            />{" "}
            <Route path={path.QUIZ_LIST_EXAM} element={<QuizListExam />} />{" "}
          </Route>
          <Route path={path.PREVIEW_CV} element={<PreviewCV />} />{" "}
        </Route>
        {/* Unauthorized when it not role */}
        <Route path={path.UNAUTHORIZED} element={<Unauthorized />} />{" "}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
