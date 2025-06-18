import React from "react";
import { Routes, Route } from "react-router-dom";
import CVManagementSystem from "./System/CvManagement";
import FormCV from "./FormCV/FormCV";
import PreviewCV from "./FormCV/PreviewCV";
import { path } from "../utils/constant";
import "../styles/tailwind.css";
import toast, { Toaster } from "react-hot-toast";
import Login from "./Auth/Login";
export default function App() {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path={path.CV_MANAGEMENT} element={<CVManagementSystem />} />{" "}
          <Route path={path.FORM_CV} element={<FormCV />} />{" "}
          <Route path={path.PREVIEW_CV} element={<PreviewCV />} />{" "}
          <Route path={path.LOGIN} element={<Login />} />{" "}
        </Routes>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
