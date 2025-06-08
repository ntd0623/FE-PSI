import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CvForm from "./Home/CvForm/CvForm";
import CvList from "./System/CvList";
import CvView from "./Home/CvView/CvView";
import Navbar from "../components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<CvForm />} />
          <Route path="/admin" element={<CvList />} />
          <Route path="/view/:id" element={<CvView />} />
        </Routes>
      </div>
    </Router>
  );
}
