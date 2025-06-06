import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CvForm.scss";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  university: "",
  major: "",
  skills: "",
  experience: "",
  avatar: null, // Thêm avatar
};

export default function CvForm() {
  const [form, setForm] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm({ ...form, avatar: reader.result }); // Lưu ảnh dạng base64
          setPreviewImage(reader.result); // Hiển thị ảnh xem trước
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let cvs = JSON.parse(localStorage.getItem("cvs") || "[]");
    const id = Date.now().toString();
    cvs.push({ id, ...form });

    localStorage.setItem("cvs", JSON.stringify(cvs));
    alert("Nộp CV thành công!");
    setForm(initialForm);
    setPreviewImage(null);

    navigate(`/view/${id}`);
  };

  return (
    <div className="cv-form">
      <h2>Tạo CV Sinh Viên</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Họ và tên:
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Số điện thoại:
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          Trường đại học:
          <input name="university" value={form.university} onChange={handleChange} required />
        </label>
        <label>
          Chuyên ngành:
          <input name="major" value={form.major} onChange={handleChange} required />
        </label>
        <label>
          Kỹ năng:
          <textarea name="skills" value={form.skills} onChange={handleChange} />
        </label>
        <label>
          Kinh nghiệm thực tập:
          <textarea name="experience" value={form.experience} onChange={handleChange} />
        </label>

        <label>
          Ảnh cá nhân:
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        </label>

        {previewImage && (
          <div>
            <p>Ảnh xem trước:</p>
            <img src={previewImage} alt="Avatar preview" width="150" height="150" style={{ borderRadius: "8px" }} />
          </div>
        )}

        <button type="submit">Nộp CV</button>
      </form>
    </div>
  );
}
