import moment from "moment";
import React from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm px-6 md:px-20 py-10">
      <div className="grid md:grid-cols-4 gap-8 border-b border-gray-700 pb-10">
        <div>
          <h4 className="text-lg font-bold mb-4 text-white">PLT Solutions</h4>
          <p className="text-gray-400">
            Nền tảng kết nối thực tập sinh IT với doanh nghiệp. Tạo cơ hội học
            tập và làm việc thực tế cho sinh viên.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-white">Khóa học</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Lập trình Web</li>
            <li>Kiểm thử phần mềm</li>
            <li>Mobile Development</li>
            <li>DevOps & CI/CD</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-white">Hỗ trợ</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Trung tâm trợ giúp</li>
            <li>Liên hệ</li>
            <li>FAQ</li>
            <li>Chính sách & bảo mật</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-white">
            Kết nối với chúng tôi
          </h4>
          <div className="flex space-x-4 text-white text-lg">
            <a
              href="https://www.facebook.com/PLTSolutions/"
              target="_blank"
              className="hover:text-blue-500"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.youtube.com/channel/UC0JU6rJmBSi3B7mkiLzxTxQ"
              target="_blank"
              className="hover:text-red-600"
            >
              <FaYoutube />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8 text-xs">
        © {moment().year()} PLT Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
