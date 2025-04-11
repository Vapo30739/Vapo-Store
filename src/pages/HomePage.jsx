import React from "react";
import Hero from "../components/Hero";
import CategoriesSection from "../components/categories/CategoriesSection";
import AllProductsSection from "../components/products/AllProductsSection";

const HomePage = () => {
  return (
    <>
      <div className="relative ">
        <div className="relative z-10">
          <Hero />
          <CategoriesSection isHome={true} />
          <AllProductsSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
