import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/images/logo.png" alt="Logo" className="logo-img" />
        <h1 className="site-name">Quản lý Sinh Viên Thực Tập</h1>
      </div>
      <div>
        <Link to="/">Tạo CV</Link>
        <Link to="/admin">Quản lý CV</Link>
      </div>
    </nav>
  );
}
