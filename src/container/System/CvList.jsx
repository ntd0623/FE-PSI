import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListCv } from "../../services/cvService";
import "./CvList.scss";

export default function CvList() {
  // Dữ liệu tĩnh mẫu
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    const fetchDataCV = async () => {
      const response = await getListCv();
      if (response && response.errCode === 0) {
        console.log("Check response: ", response);
        setCvs(response.data);
      }
    };

    fetchDataCV();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa CV này?")) {
      const filtered = cvs.filter((cv) => cv.id !== id);
      setCvs(filtered);
    }
  };

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
          {cvs && cvs.length > 0 ? (
            cvs.map((cv) => (
              <tr key={cv.id}>
                <td>
                  <img
                    src={
                      cv?.User?.image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    width="60"
                    height="60"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                </td>
                <td>{cv?.User?.fullName || "Chưa có"}</td>
                <td>{cv?.User?.email || "Chưa có"}</td>
                <td>{cv?.User?.school_name || "Chưa có"}</td>
                <td>{cv?.User?.major || "Chưa có"}</td>

                <td>
                  <Link to={`/view/${cv.id}`}>
                    <button>XEM</button>
                  </Link>{" "}
                  <button onClick={() => handleDelete(cv.id)}>XÓA</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
