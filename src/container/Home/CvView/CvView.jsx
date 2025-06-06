import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CvView.scss";

export default function CvView() {
  const { id } = useParams();
  const [cv, setCv] = useState(null);

  useEffect(() => {
    const cvs = JSON.parse(localStorage.getItem("cvs") || "[]");
    const found = cvs.find((c) => c.id === id);
    setCv(found);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!cv) return <p>Không tìm thấy CV.</p>;

  return (
    <div className="cv-view">
      <h2>CV của {cv.name}</h2>

      {cv.avatar && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img
            src={cv.avatar}
            alt="avatar"
            width="150"
            height="150"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ccc",
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      )}

      <div className="cv-content">
        <p><strong>Họ và tên:</strong> {cv.name}</p>
        <p><strong>Email:</strong> {cv.email}</p>
        <p><strong>Số điện thoại:</strong> {cv.phone}</p>
        <p><strong>Trường đại học:</strong> {cv.university}</p>
        <p><strong>Chuyên ngành:</strong> {cv.major}</p>
        <p><strong>Kỹ năng:</strong> {cv.skills}</p>
        <p><strong>Kinh nghiệm thực tập:</strong> {cv.experience}</p>
      </div>

      <button onClick={handlePrint}>In CV</button>
      <br />
      <Link to="/">Quay lại Tạo CV</Link> | <Link to="/admin">Quản lý CV</Link>
    </div>
  );
}
