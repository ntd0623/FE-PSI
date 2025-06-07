import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CvList.scss";

export default function CvList() {
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    const storedCvs = JSON.parse(localStorage.getItem("cvs") || "[]");
    setCvs(storedCvs);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa CV này?")) {
      const filtered = cvs.filter((cv) => cv.id !== id);
      setCvs(filtered);
      localStorage.setItem("cvs", JSON.stringify(filtered));
    }
  };

  if (cvs.length === 0) {
    return <p>Chưa có CV nào được nộp.</p>;
  }

  return (
    <div className="cv-list">
      <h2>Quản lý CV</h2>
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Trường</th>
            <th>Chuyên ngành</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cvs.map((cv) => (
            <tr key={cv.id}>
              <td>
                {cv.avatar ? (
                  <img
                    src={cv.avatar}
                    alt="avatar"
                    width="60"
                    height="60"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span>Chưa có</span>
                )}
              </td>
              <td>{cv.name}</td>
              <td>{cv.email}</td>
              <td>{cv.university}</td>
              <td>{cv.major}</td>
              <td>
                <Link to={`/view/${cv.id}`}>
                  <button>XEM</button>
                </Link>{" "}
                <button onClick={() => handleDelete(cv.id)}>XÓA</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
