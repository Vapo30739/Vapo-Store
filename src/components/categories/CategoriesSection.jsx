import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoriesListing from "./CategoriesListing";
import { CiCirclePlus } from "react-icons/ci";

const CategoriesSection = () => {
  const token = localStorage.getItem("token");

  return (
    <section>
      <h2 className="text-xl font-bold bg-red-800 mb-2 text-center py-2 rounded-full">
        الأقسام الرئيسية
      </h2>
      <div className="flex flex-row-reverse justify-end items-center mb-5 px-2 text-xs">
        {token && (
          <Link to="/add-category">
            <CiCirclePlus size={30} color="white" className="g-gray-200" />
          </Link>
        )}
      </div>

      <CategoriesListing />
    </section>
  );
};

export default CategoriesSection;
