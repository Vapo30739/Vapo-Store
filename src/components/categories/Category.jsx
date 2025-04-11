import React, { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { deleteItem } from "../../api/axios";
import { FaEdit } from "react-icons/fa";

const Category = ({ category, removeCategory }) => {
  const [hasAppeared, setHasAppeared] = useState(false);

  const [popupView, setPopupView] = useState(false);
  const productRef = useRef(null);
  const token = localStorage.getItem("token");

  const deleteCategory = async () => {
    try {
      await deleteItem("category", category._id, token);
      setPopupView(false);
      removeCategory(category._id);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAppeared) {
          setHasAppeared(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentElement = productRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [hasAppeared]);

  return (
    <>
      <div
        ref={productRef}
        className={`w-full transform transition-all duration-500 ease-in-out ${
          hasAppeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } flex flex-col justify-center items-center border border-1 border-white rounded-lg bg-white p-3 shadow-lg`}
      >
        <Link
          to={`/products/${category._id}`}
          state={{ categoryDetails: category }}
          className="w-full h-full flex flex-col items-center"
        >
          <img
            className="mb-3 rounded-full w-full h-full max-w-[140px] h-[140px]"
            src={category.image}
            alt=""
          />
          <p>{category.name}</p>
        </Link>

        {token && (
          <div className="w-full flex justify-center items-center gap-x-5 mt-5 ">
            <MdDelete
              className="cursor-pointer"
              color="red"
              onClick={() => setPopupView(true)}
              size={30}
            />
            <Link
              to={`/edit-category/${category._id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <FaEdit size={30} color="#d0bf4c" className="cursor-pointer" />
            </Link>
          </div>
        )}
      </div>
      {popupView && (
        <div
          className="min-h-screen w-full bg-black z-10 fixed top-0 left-0 bg-opacity-70 flex justify-center items-center"
          onClick={() => setPopupView(false)}
        >
          <div
            dir="rtl"
            className="bg-white text-black p-6 rounded-lg shadow-lg w-[80vw] max-w-[400px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
            <p className="mb-6">
              هل أنت متأكد من حذف القسم{" "}
              <span className="font-bold">"{category.name}"</span>؟
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={deleteCategory}
              >
                نعم، احذف
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setPopupView(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
