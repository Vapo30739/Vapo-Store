import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <nav className="bg-red-800 p-1 flex justify-between items-center">
        {/* Left Side: Sidebar Toggle & Logo */}
        <div className="flex items-center">
          <button
            className="text-3xl focus:outline-none mr-3"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <Link to={"/"} className="flex items-center space-x-2">
            <img
              className="h-[30px] w-[30px] rounded-full cursor-pointer"
              src={logo}
              alt="React Jobs"
            />
            <p className="font-bold text-xs">VAPO ABO MARIAM</p>
          </Link>
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="flex items-center space-x-3">
          {token && (
            <Link
              to={"/settings"}
              className="text-xs text-yellow-400 hidden xs:inline-block"
            >
              Admin mode!
            </Link>
          )}
          {token ? (
            <button
              className="font-bold text-xs text-black border-2 border-black p-1 rounded-full"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Link
              to={"/login"}
              className="font-bold text-xs text-black border-2 border-black p-1 rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        token={token}
      />
    </div>
  );
};

export default Navbar;
