import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { deleteItem } from "../api/axios";

const FAQ = ({ question, answer, images, id }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [visible, setVisible] = useState(false);
  const [popupView, setPopupView] = useState(false);
  const [exist, setExist] = useState(true);
  const token = localStorage.getItem("token");

  const deleteFAQ = async () => {
    try {
      await deleteItem("faq", id, token);
      setExist(false);
      setPopupView(false);
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const setExpand = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div
        dir="rtl"
        className={
          exist
            ? "w-100 my-5 bg-black bg-opacity-40 border border-2 rounded-lg p-5"
            : "hidden w-100 my-5 bg-black bg-opacity-40 border border-2 rounded-lg p-5"
        }
      >
        <div
          className={`flex items-center justify-between cursor-pointer ${visible && "mb-10"}`}
          onClick={setExpand}
        >
          <p className="w-100 text-xl text-red-400 font-bold">{question}</p>
          <div className="flex items-center flex-row-reverse">
            <div>
              {" "}
              {visible ? (
                <FaChevronUp className="text-gray-500 " />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {token && (
              <div className="flex justify-around items-center mx-2">
                <MdDelete
                  className="cursor-pointer ml-1"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupView(true);
                  }}
                  size={30}
                />

                <Link to={`/edit-faq/${id}`}>
                  <FaEdit
                    size={30}
                    color="#d0bf4c"
                    className="cursor-pointer"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className={`${visible ? "block" : "hidden"}`}>
          <p className="w-full whitespace-pre-wrap text-white text-md font-bold">
            {answer}
          </p>

          {images?.length > 0 && (
            <div className="w-full">
              <div className="w-full flex justify-center items-center mb-5">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="rounded w-[350px] h-[350px] object-contain"
                />
              </div>

              {images?.length > 1 && (
                <div className="flex w-full justify-center items-center mb-5">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="rounded-full w-10 h-10 mx-1 cursor-pointer object-cover"
                      onClick={() => setMainImage(image)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {popupView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10"
          onClick={() => setPopupView(false)}
        >
          <div
            dir="rtl"
            className="bg-white text-black p-6 rounded-lg shadow-lg w-[80vw] max-w-[400px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
            <p className="mb-6">
              هل أنت متأكد من حذف السؤال الشائع{" "}
              <span className="font-bold">"{question}"</span>؟
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => deleteFAQ()}
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

export default FAQ;
