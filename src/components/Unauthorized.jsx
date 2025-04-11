import React from "react";
import BackButton from "../components/BackButton";

const Unauthorized = () => {
  return (
    <div className="relative w-[80vw] mx-auto bg-transparent py-7">
      <div dir="rtl">
        <h1 className="text-2xl font-bold text-red-500 mb-5">وصول مرفوض</h1>
        <p className="text-white mb-5">
          يجب تسجيل الدخول للوصول الى هذه الصفحة
        </p>
      </div>
      <BackButton />
    </div>
  );
};

export default Unauthorized;
