import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(false);
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("hasNavigated");

    if (isFirstVisit) {
      setShowBackButton(true);
    } else {
      sessionStorage.setItem("hasNavigated", "true");
    }
  }, []);
  return (
    <div className="p-4 flex  justify-between">
      <Link
        className="border border-2 py-1 px-4 rounded-full inline-block text-sm mb-5 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-md"
        to={"/"}
      >
        العودة الى الصفحة الرئيسية
      </Link>
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="border border-2 py-1 px-4 rounded-full inline-block text-sm mb-5 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-md"
        >
          رجوع
        </button>
      )}
    </div>
  );
};

export default BackButton;
