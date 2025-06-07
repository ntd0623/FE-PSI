import React from "react";
import { Routes, Route } from "react-router-dom";
// import CvForm from "../container/System/";
import CvList from "../container/System/CvList";
// import CvView from "./container/Home/CvView/CvView";
// import Navbar from "../";
import { path } from "../utils/constant";
export default function App() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="container">
        <Routes>
          {/* Trang tạo CV */}
          {/* <Route path={path.HOME} element={<CvForm />} /> */}
          {/* Trang quản lý CV */}
          <Route path={path.ADMIN} element={<CvList />} />{" "}
          {/* Trang xem/in CV */}
          {/* <Route path={path.VIEW} element={<CvView />} />{" "} */}
        </Routes>
      </div>
    </>
  );
}
