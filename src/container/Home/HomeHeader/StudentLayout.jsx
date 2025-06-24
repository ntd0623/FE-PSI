import React from "react";
import Header from "./HomeHeader";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default StudentLayout;
