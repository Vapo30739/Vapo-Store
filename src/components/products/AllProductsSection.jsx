import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductsListing from "./ProductsListing";
import { CiCirclePlus } from "react-icons/ci";

const AllProductsSection = () => {
  const token = localStorage.getItem("token");

  return (
    <section>
      <h2 className="text-xl font-bold bg-red-800 mb-2 text-center py-2 rounded-full">
        جميع المنتجات
      </h2>
      <div className="flex flex-row-reverse justify-end items-center px-2 text-xs">
        {token ? (
          <Link className="" to={"/add-product"}>
            <CiCirclePlus size={30} color="white" className="g-gray-200" />
          </Link>
        ) : (
          ""
        )}
      </div>

      <ProductsListing />
    </section>
  );
};

export default AllProductsSection;
