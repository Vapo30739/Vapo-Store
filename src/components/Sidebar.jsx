import React from "react";
import { Link } from "react-router-dom";
import motionBg2 from "../assets/motion2.jpg";

const Sidebar = ({ isOpen, toggleSidebar, token }) => {
  return (
    <>
      <div
        dir="rtl"
        className={`fixed z-50 top-0 left-0 h-screen w-9/12 max-w-sm text-white 
          transition-transform ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
      >
        {/* Background Image with Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${motionBg2})`,
            opacity: 0.8,
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-90 z-0"></div>

        {/* Sidebar Content */}
        <div className="relative z-10 p-4">
          <button
            className="text-xl absolute top-4 left-4 focus:outline-none"
            onClick={toggleSidebar}
          >
            ✕
          </button>
          <div className="mt-10 space-y-4">
            <Link
              to="/"
              className="block text-lg font-medium hover:text-gray-300"
              onClick={toggleSidebar}
            >
              الصفحة الرئيسية
            </Link>
            <Link
              to="/about-us"
              className="block text-lg font-medium hover:text-gray-300"
              onClick={toggleSidebar}
            >
              عن Vapo Abo Mariam
            </Link>
            <Link
              to="/faq"
              className="block text-lg font-medium hover:text-gray-300"
              onClick={toggleSidebar}
            >
              الأسئلة الشائعة
            </Link>
            {token && (
              <div className="space-y-4">
                <Link
                  to="/settings"
                  className="block text-lg font-medium hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Settings
                </Link>
                <Link
                  to="/add-product"
                  className="block text-lg font-medium hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Add New Product
                </Link>
                <Link
                  to="/add-category"
                  className="block text-lg font-medium hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Add New Category
                </Link>
                <Link
                  to="/add-faq"
                  className="block text-lg font-medium hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  Add New FAQ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed z-40 inset-0 bg-black bg-opacity-70 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
