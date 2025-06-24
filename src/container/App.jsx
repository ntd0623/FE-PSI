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
export default function App() {
  return (
    <>
      <div className="container ">
        <Routes>
          <Route path={path.HOME} element={<HomePage />} /> {/* ROUTE LOGIN */}
          <Route path={path.LOGIN} element={<Login />} />{" "}
          {/* ROUTE LOGIN WITH FACEBOOK */}
          <Route
            path={path.FACEBOOK_CALLBACK}
            element={<FacebookCallback />}
          />{" "}
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
            </Route>
            <Route path={path.PREVIEW_CV} element={<PreviewCV />} />{" "}
          </Route>
          {/* Unauthorized when it not role */}
          <Route path={path.UNAUTHORIZED} element={<Unauthorized />} />{" "}
        </Routes>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
