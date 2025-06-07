import React from "react";
import { Routes, Route } from "react-router-dom";
import CvForm from "./container/Home/CvForm/CvForm";
import CvList from "./container/System/CvList";
import CvView from "./container/Home/CvView/CvView";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<CvForm />} />         {/* Trang tạo CV */}
          <Route path="/admin" element={<CvList />} />    {/* Trang quản lý CV */}
          <Route path="/view/:id" element={<CvView />} /> {/* Trang xem/in CV */}
        </Routes>
      </div>
    </>
  );
}
