import React, { useState, useRef, useEffect } from "react";
import { User, Plus, X } from "lucide-react";
import { getBase64 } from "../../utils/CommonUtils";
import { CRUD_ACTIONS } from "../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { navigateToCVPreview } from "../../utils/navigateWithState";
import { getAllCode, upsertCV, getCV } from "../../services/studentService";
import { useSelector } from "react-redux";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import toast from "react-hot-toast";
const UpdateCV = () => {
  const defaultFormData = {
    fullName: "",
    email: "",
    phone: "",
    birthDay: "",
    gender: "",
    degree: "",
    address: "",
    university: "",
    major: "",
    gpa: "",
    graduationYear: "",
    careerGoal: "",
    achievements: "",
    references: "",
    skills: {
      programming: [],
      softSkills: [],
      languages: [],
    },
    experience: [],
    projects: [],
  };
  // User
  const user = useSelector((state) => state?.user?.userInfo);
  const { id } = useParams();

  // list gender load api
  const [listGender, setListGender] = useState("");
  // list degree load api
  const [listDegree, setListDegree] = useState("");
  const [cvData, setCvData] = useState("");
  // Flag fetch
  const hasFetched = useRef(false);
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    university: "",
    major: "",
    degree: "",
    gpa: "",
    graduationYear: "",
    projects: [
      {
        name: "",
        technologies: "",
        description: "",
        link: "",
      },
    ],
    experience: [
      {
        nameCompany: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        link: "",
      },
    ],
    skills: {
      programming: [],
      softSkills: [],
      languages: [],
    },
    careerGoal: "",
    achievements: "",
    references: "",
  });
  //BirthDay data
  const [birthDay, setBirthDay] = useState("");
  //Skill data
  const [skillInputs, setSkillInputs] = useState({
    programming: "",
    softSkills: "",
    languages: "",
  });
  // Avatar
  const [avatar, setAvatar] = useState("");
  // Preview Avatar
  const [imageFile, setImageFile] = useState(null);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const fileInputRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  //fetch api

  useEffect(() => {
    if (hasFetched.current) return; // if fetched return
    hasFetched.current = true;
    // Call API once times when mount component
    const fetchData = async () => {
      try {
        const listGender = await getAllCode("GENDER");
        const listDegree = await getAllCode("DEGREE");
        const studentID = user.id;
        console.log("Check student ID: ", studentID);
        const dataCV = await getCV({ studentID: studentID, cvID: id });
        if (
          listDegree.errCode === 0 &&
          listGender.errCode === 0 &&
          dataCV.errCode === 0
        ) {
          setListGender(listGender.data);
          setListDegree(listDegree.data);
          setCvData(dataCV.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // set Form
  useEffect(() => {
    const localData = localStorage.getItem("cvData");
    let data = null;

    if (localData) {
      try {
        data = JSON.parse(localData);
      } catch (e) {
        console.error("Lỗi parse localStorage:", e);
      }
    }

    const source = data || cvData;

    if (source) {
      if (source === data) {
        setFormData({
          fullName: source?.formData?.fullName || "",
          email: source?.formData?.email || "",
          phone: source?.formData?.phone || "",
          gender: source?.formData?.gender || "",
          address: source?.formData?.address || "",
          university: source?.formData?.university || "",
          major: source?.formData?.major || "",
          degree: source?.formData?.degree || "",
          gpa: source?.formData?.gpa || "",
          graduationYear: source?.formData?.graduationYear || "",
          projects: source?.formData?.projects?.map((p) => ({
            name: p.name || "",
            technologies: p.technologies || "",
            description: p.description || "",
            link: p.github_url || p.demo_url || p.link || "",
          })) || [
            {
              name: "",
              technologies: "",
              description: "",
              link: "",
            },
          ],
          experience: source?.formData?.experience?.map((e) => ({
            nameCompany: e.nameCompany || "",
            position: e.position || "",
            startDate: e.startDate || "",
            endDate: e.endDate || "",
            description: e.description || "",
            link: e.link || "",
          })) || [
            {
              nameCompany: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
              link: "",
            },
          ],
          skills: {
            programming: source?.formData?.skills?.programming,
            softSkills: source?.formData?.skills?.softSkills,
            languages: source?.formData?.skills?.languages,
          },
          careerGoal: source?.formData?.careerGoal || "",
          achievements: source?.formData?.achievements || "",
          references: source?.formData?.references || "",
        });
        setBirthDay(source.birthDay || "");
        setAvatar(source.avatar || "");
      } else {
        setFormData({
          fullName: source.fullName || "",
          email: source.email || "",
          phone: source.phoneNumber || "",
          gender: source.genderID || "",
          address: source.address || "",
          university: source.schoolName || "",
          major: source.major || "",
          degree: source.degreeID || "",
          gpa: source.gpa || "",
          graduationYear: source.graduationYear || "",
          projects: source.projects?.map((p) => ({
            name: p.name || "",
            technologies: p.technologies || "",
            description: p.description || "",
            link: p.github_url || p.demo_url || p.link || "",
          })) || [
            {
              name: "",
              technologies: "",
              description: "",
              link: "",
            },
          ],
          experience: source.experiences?.map((e) => ({
            nameCompany: e.company || e.nameCompany || "",
            position: e.position || "",
            startDate: e.start_date || e.startDate || "",
            endDate: e.end_date || e.endDate || "",
            description: e.description || "",
            link: e.link || "",
          })) || [
            {
              nameCompany: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
              link: "",
            },
          ],
          skills: {
            programming:
              source.skills
                ?.filter((s) => s.type === "programming")
                .map((s) => s.name) || [],
            softSkills:
              source.skills
                ?.filter((s) => s.type === "softSkills")
                .map((s) => s.name) || [],
            languages:
              source.skills
                ?.filter((s) => s.type === "languages")
                .map((s) => s.name) || [],
          },
          careerGoal: source.career_objective || "",
          achievements: source.archivement || "",
          references: source.references || "",
        });
        setBirthDay(source.birthDay || "");
        setAvatar(source.image || "");
      }
    }
  }, [cvData]);

  // handle change Avatar
  const handleOnChangeImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const base64 = await getBase64(file);

      setAvatar(base64);
      setImageFile(objectUrl);
    }
  };
  // Open Dialog
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Mở hộp thoại chọn ảnh
    }
  };
  // Process Preview Avartar
  const openPreview = () => {
    if (imageFile) {
      setIsOpenPreview(true);
    }
  };
  // setState Input
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };
  //setState Project
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      projects: newProjects,
    }));
  };
  //setExperience
  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      experience: newExperience,
    }));
  };
  // processs add info experience
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          nameCompany: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          link: "",
        },
      ],
    }));
  };
  //Delete Experience
  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };
  // process add info project
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", technologies: "", description: "", link: "" },
      ],
    }));
  };
  // remove project
  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };
  // add Info Skill
  const addSkill = (category) => {
    const skill = skillInputs[category].trim();
    if (skill) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill],
        },
      }));
      setSkillInputs((prev) => ({
        ...prev,
        [category]: "",
      }));
    }
  };
  // remove skill
  const removeSkill = (category, index) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }));
  };
  // setState Input
  const handleSkillInputChange = (category, value) => {
    setSkillInputs((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  // Enter add new Skill
  const handleSkillKeyPress = (e, category) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(category);
    }
  };

  //validate
  const validateForm = () => {
    const errors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      errors.fullName = "Họ và tên không được để trống !";
    } else if (!/^[a-zA-ZÀ-ỹ\s'.-]+$/.test(formData.fullName)) {
      errors.fullName = "Họ và tên không được chứa số hoặc ký tự đặc biệt !";
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email không được để trống !";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Email không hợp lệ. Ví dụ đúng: ten@example.com !";
    }

    // phone
    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống !";
    } else if (!/^[0-9]{9,11}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại phải gồm 9 đến 11 chữ số !";
    }
    // Address
    if (!formData.address.trim()) {
      errors.address = "Địa chỉ không được để trống !";
    }
    // birthDay
    if (!birthDay) {
      errors.birthDay = "Ngày sinh không được bỏ trống !";
    } else if (birthDay) {
      const selectedDate = new Date(birthDay);
      const today = new Date();
      if (selectedDate > today) {
        errors.birthDay = "Ngày sinh không được lớn hơn ngày hiện tại !";
      }
    }

    // major
    if (!formData.major.trim()) {
      errors.major = "Chuyên ngành không được để trống !";
    }

    // school
    if (!formData.university.trim()) {
      errors.university = "Trường không được để trống !";
    }

    if (!formData.gender) {
      errors.gender = "Giới tính không được để trống";
    }

    // degree
    if (!formData.degree) {
      errors.degree = "Vui lòng chọn bằng cấp !";
    }

    // GPA
    if (!formData.gpa) {
      errors.gpa =
        "Điểm số không được bỏ trống. Có thể lấy tổng điểm gần nhất!";
    } else if (isNaN(Number(formData.gpa))) {
      errors.gpa = "GPA phải là số!";
    } else {
      const gpa = parseFloat(formData.gpa);
      if (gpa < 0 || gpa > 4.0) {
        errors.gpa = "GPA phải nằm trong khoảng từ 0 đến 4.0!";
      }
    }

    // graduation Year
    if (!formData.graduationYear) {
      errors.graduationYear =
        "Năm tốt nghiệp không được bỏ trống. Có thể để năm tốt nghiệp dự kiến";
    } else if (
      formData.graduationYear &&
      !/^[0-9]{4}$/.test(formData.graduationYear)
    ) {
      errors.graduationYear = "Năm tốt nghiệp phải là 4 chữ số !";
    }

    //Career objective
    if (!formData.careerGoal) {
      errors.careerGoal = "Mục tiêu không được bỏ trống !";
    }

    if (!formData.references) {
      errors.references = "Người hướng dẫn không được bỏ trống !";
    }

    return errors;
  };

  // handle Submit
  const handleSubmit = async () => {
    console.log("Check state: ", formData, avatar);
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    const confirmed = window.confirm(
      "Bạn có chắc muốn cập nhập lại CV không? Hãy chắc rằng bạn đã xem lại toàn bộ thông tin."
    );
    if (!confirmed) return;
    const cv = await upsertCV({
      cvID: id,
      userID: user.id,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phone,
      birthDay: birthDay,
      genderID: formData.gender,
      degreeID: formData.degree,
      address: formData.address,
      school_name: formData.university,
      major: formData.major,
      gpa: formData.gpa,
      graduationYear: formData.graduationYear,
      career_objective: formData.careerGoal,
      archivements: formData.achievements,
      references: formData.references,
      skills: formData.skills,
      experience: formData.experience,
      projects: formData.projects,
      image: avatar,
      action: CRUD_ACTIONS.EDIT,
    });
    if (cv && cv.errCode === 0) {
      toast.success("Cập nhập CV thành công !");
      setFormData(defaultFormData);
      setAvatar(null);
      setImageFile(null);
      setBirthDay(null);
      localStorage.removeItem("cvData");
    } else {
      toast.error("Tạo CV thất bại. Vui lòng thử lại.");
    }
  };
  // get color skill
  const getSkillBadgeColor = (category) => {
    switch (category) {
      case "programming":
        return "bg-blue-100 text-blue-800";
      case "softSkills":
        return "bg-green-100 text-green-800";
      case "languages":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // get color button skill
  const getButtonColor = (category) => {
    switch (category) {
      case "programming":
        return "bg-blue-600 hover:bg-blue-700";
      case "softSkills":
        return "bg-green-600 hover:bg-green-700";
      case "languages":
        return "bg-yellow-600 hover:bg-yellow-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Navigate Preview CV
  const navigate = useNavigate();
  const handlePreview = () => {
    const degreeValue = listDegree.find(
      (item) => item?.key === formData.degree
    );
    const cvData = {
      formData,
      avatar,
      birthDay,
      degreeValue,
      cvID: id,
      action: CRUD_ACTIONS.EDIT,
    };
    localStorage.setItem("cvData", JSON.stringify(cvData));
    navigateToCVPreview(navigate, cvData);
  };
  useEffect(() => {
    const stored = localStorage.getItem("cvData");

    if (stored && stored !== "undefined") {
      try {
        const parsed = JSON.parse(stored);

        setFormData(parsed.formData || {});
        setAvatar(parsed.avatar || "");
        setBirthDay(parsed.birthDay || "");
      } catch (error) {
        console.error("Lỗi khi parse JSON từ localStorage:", error);
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 border-b border-gray-200 pb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0 text-center">
            Sửa CV
          </h1>
          <button className="text-blue-600 hover:text-blue-800 text-sm self-start sm:self-auto">
            Thực tập sinh
          </button>
        </div>

        {/* Profile */}
        <div className="mb-8">
          <div className="flex flex-col items-center mb-6">
            {/* Vòng tròn Avatar preview */}
            <div
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden cursor-pointer"
              onClick={openPreview}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>

            {/* Nút tải ảnh */}
            <button
              onClick={handleButtonClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Tải ảnh lên
            </button>

            {/* File input bị ẩn */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleOnChangeImage}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Họ và tên *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Nhập email"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ngày sinh
              </label>
              <input
                type="date"
                value={birthDay}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setBirthDay(e.target.value)}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.birthDay
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.birthDay && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.birthDay}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Giới tính
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${
                      formErrors.gender
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }

                  `}
              >
                <option value="" disabled>
                  Chọn giới tính
                </option>
                {listGender &&
                  listGender.length > 0 &&
                  listGender.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.value_VI}
                      </option>
                    );
                  })}
              </select>
              {formErrors.gender && (
                <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                   ${
                     formErrors.address
                       ? "border-red-500 focus:ring-red-500"
                       : "border-gray-300 focus:ring-blue-500"
                   }
                  `}
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3">
              2
            </div>
            <h2 className="text-lg font-semibold">Học vấn</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Trường *
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) =>
                  handleInputChange("university", e.target.value)
                }
                placeholder="Tên trường"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-50
                  ${
                    formErrors.university
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.university && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.university}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chuyên ngành *
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
                placeholder="Chuyên ngành học"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.major
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.major && (
                <p className="text-red-500 text-sm mt-1">{formErrors.major}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bằng cấp
              </label>
              <select
                value={formData.degree}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.degree
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              >
                <option value="" disabled>
                  Chọn bằng cấp
                </option>
                {listDegree &&
                  listDegree.length > 0 &&
                  listDegree.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.value_VI}
                      </option>
                    );
                  })}
              </select>
              {formErrors.degree && (
                <p className="text-red-500 text-sm mt-1">{formErrors.degree}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                GPA
              </label>
              <input
                type="text"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => handleInputChange("gpa", e.target.value)}
                placeholder="VD: 3.5/4.0"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.gpa
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.gpa && (
                <p className="text-red-500 text-sm mt-1">{formErrors.gpa}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Năm tốt nghiệp (dự kiến)
              </label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={(e) =>
                  handleInputChange("graduationYear", e.target.value)
                }
                placeholder="2024"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.graduationYear
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.graduationYear && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.graduationYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3">
                3
              </div>
              <h2 className="text-lg font-semibold">Kinh nghiệm làm việc</h2>
            </div>
            <button
              onClick={addExperience}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Thêm kinh nghiệm
            </button>
          </div>

          {formData.experience &&
            formData.experience.length > 0 &&
            formData.experience.map((exp, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Kinh nghiệm {index + 1}</h3>
                  {formData.experience.length > 1 && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Công ty/Tổ chức
                    </label>
                    <input
                      type="text"
                      value={exp.nameCompany}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "nameCompany",
                          e.target.value
                        )
                      }
                      placeholder="Tên công ty"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Vị trí
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      placeholder="Vị trí công việc"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ngày Bắt Đầu
                    </label>
                    <input
                      type="date"
                      max={exp.endDate || undefined}
                      value={exp.startDate}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ngày Kết Thúc
                    </label>
                    <input
                      type="date"
                      value={exp.endDate}
                      min={exp.startDate || undefined}
                      onChange={(e) =>
                        handleExperienceChange(index, "endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mô tả công việc
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Skills - Updated Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3">
              4
            </div>
            <h2 className="text-lg font-semibold">Kỹ năng</h2>
          </div>

          <div className="space-y-6">
            {/* Programming Skills */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Kỹ năng kỹ thuật
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.programming &&
                  formData.skills.programming.length > 0 &&
                  formData.skills.programming.map((skill, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSkillBadgeColor(
                        "programming"
                      )}`}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill("programming", index)}
                        className="ml-2 text-current hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInputs.programming}
                  onChange={(e) =>
                    handleSkillInputChange("programming", e.target.value)
                  }
                  onKeyPress={(e) => handleSkillKeyPress(e, "programming")}
                  placeholder="VD: JavaScript, Python"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addSkill("programming")}
                  className={`px-4 py-2 text-white text-sm rounded-md ${getButtonColor(
                    "programming"
                  )}`}
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Kỹ năng mềm
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.softSkills &&
                  formData.skills.softSkills.length > 0 &&
                  formData.skills.softSkills.map((skill, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSkillBadgeColor(
                        "softSkills"
                      )}`}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill("softSkills", index)}
                        className="ml-2 text-current hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInputs.softSkills}
                  onChange={(e) =>
                    handleSkillInputChange("softSkills", e.target.value)
                  }
                  onKeyPress={(e) => handleSkillKeyPress(e, "softSkills")}
                  placeholder="VD: Teamwork, Communication"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addSkill("softSkills")}
                  className={`px-4 py-2 text-white text-sm rounded-md ${getButtonColor(
                    "softSkills"
                  )}`}
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Ngôn ngữ
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.languages.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSkillBadgeColor(
                      "languages"
                    )}`}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill("languages", index)}
                      className="ml-2 text-current hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInputs.languages}
                  onChange={(e) =>
                    handleSkillInputChange("languages", e.target.value)
                  }
                  onKeyPress={(e) => handleSkillKeyPress(e, "languages")}
                  placeholder="VD: Tiếng Anh (TOEIC 800)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addSkill("languages")}
                  className={`px-4 py-2 text-white text-sm rounded-md ${getButtonColor(
                    "languages"
                  )}`}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3">
                5
              </div>
              <h2 className="text-lg font-semibold">Dự Án</h2>
            </div>
            <button
              onClick={addProject}
              className="bg-blue-600 text-white px-4 py-2 shadow-sm rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Thêm dự án
            </button>
          </div>

          {formData.projects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Dự án {index + 1}</h3>
                {formData.projects.length > 1 && (
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tên dự án
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) =>
                      handleProjectChange(index, "name", e.target.value)
                    }
                    placeholder="Tên dự án"
                    className="w-full px-3 py-2 border shadow-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Công nghệ sử dụng
                  </label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) =>
                      handleProjectChange(index, "technologies", e.target.value)
                    }
                    placeholder="VD: React, Node.js, MongoDB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Link dự án
                </label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) =>
                    handleProjectChange(index, "link", e.target.value)
                  }
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mô tả dự án
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) =>
                    handleProjectChange(index, "description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Add Information */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full mr-3">
              6
            </div>
            <h2 className="text-lg font-semibold">Thông tin bổ sung</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mục tiêu nghề nghiệp
              </label>
              <textarea
                value={formData.careerGoal}
                onChange={(e) =>
                  handleInputChange("careerGoal", e.target.value)
                }
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    formErrors.careerGoal
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }
                  `}
              />
              {formErrors.careerGoal && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.careerGoal}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Thành tích & Giải thưởng
              </label>
              <textarea
                value={formData.achievements}
                onChange={(e) =>
                  handleInputChange("achievements", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Người tham khảo
              </label>
              <textarea
                value={formData.references}
                onChange={(e) =>
                  handleInputChange("references", e.target.value)
                }
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  formErrors.references
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }
                `}
              />
              {formErrors.references && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.references}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreview}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
          >
            Xem trước CV
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            onClick={() => handleSubmit()}
          >
            Cập Nhập CV
          </button>
        </div>
      </div>
      {/* Lightbox for image preview */}
      <Lightbox
        open={isOpenPreview}
        close={() => setIsOpenPreview(false)}
        slides={[{ src: imageFile }]}
      />
    </div>
  );
};

export default UpdateCV;
