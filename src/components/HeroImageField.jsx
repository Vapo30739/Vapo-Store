import React, { useEffect, useState } from "react";

import { deleteHeroImage, editHeroImages } from "../api/axios";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const HeroImageField = ({ inputDetails, endpoint, name }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [imagePreviews, setImagePreviews] = useState(inputDetails?.hero || []);
  const [popupView, setPopupView] = useState(false);
  const [inputKeys, setInputKeys] = useState(
    (inputDetails?.hero || []).map(() => Date.now())
  );
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (inputDetails?.hero) {
      setImagePreviews([...inputDetails.hero]);
      setInputKeys(inputDetails.hero.map(() => Date.now()));
    }
  }, [inputDetails]);

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreviews((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const clearImage = (index) => {
    setImagePreviews((prev) => {
      const updated = [...prev];
      updated[index] = inputDetails?.hero?.[index] || null;
      return updated;
    });

    setInputKeys((prev) => {
      const updated = [...prev];
      updated[index] = Date.now();
      return updated;
    });
  };

  const deleteImage = async (index) => {
    try {
      await deleteHeroImage(index, token);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setPopupView(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  const editImage = async (index) => {
    try {
      const updatedFile = imagePreviews[index];
      if (!updatedFile || typeof updatedFile === "string") {
        alert("Please select an image before updating.");
        return;
      }

      await editHeroImages(endpoint, index, updatedFile, token);

      alert(`Image ${index + 1} updated successfully.`);
    } catch (error) {
      alert("Failed to update image.");
    }
  };

  return (
    <>
      {" "}
      <div className="border border-2 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer p-5"
          onClick={() => setVisible(!visible)}
        >
          <p className="text-md text-white font-bold">Hero Images</p>
          {visible ? (
            <FaChevronUp className="text-white" />
          ) : (
            <FaChevronDown className="text-white" />
          )}
        </div>

        {/* Expand/Collapse Animation */}
        <div
          className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
            visible ? "max-h-[20000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {imagePreviews.length === 0 ? (
            <p className="text-sm text-gray-400 font-bold p-5">
              {name} has no Images!
            </p>
          ) : (
            imagePreviews.map((image, index) => (
              <div key={index} className="px-5 py-3 border-b border-gray-700">
                <div className="flex flex-col space-y-2">
                  <label className="text-white">Image {index + 1}</label>
                  <input
                    key={inputKeys[index]}
                    type="file"
                    className="border rounded p-2 w-full text-white text-sm \"
                    onChange={(event) => handleFileChange(event, index)}
                  />
                  <button
                    type="button"
                    onClick={() => clearImage(index)}
                    className="bg-red-500 text-white p-1 rounded text-xs w-20"
                  >
                    Clear
                  </button>
                </div>

                {image && (
                  <div className="flex justify-center items-center mt-3">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Preview ${index}`}
                      className="rounded w-[350px] h-[250px] object-contain"
                    />
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  <button
                    type="button"
                    // onClick={() => deleteImage(index)}
                    onClick={() => {
                      setSelectedIndex(index);
                      setPopupView(true);
                    }}
                    className="flex items-center bg-red-500 text-white p-2 rounded text-sm"
                  >
                    <MdDelete className="mr-1" size={18} /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => editImage(index)}
                    className="flex items-center bg-green-500 text-white p-2 rounded text-sm"
                  >
                    <FaEdit className="mr-1" size={18} /> Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
              هل أنت متأكد من حذف الصورة{" "}
              <span className="font-bold">
                "{selectedIndex !== null ? selectedIndex + 1 : ""}"
              </span>
              ؟
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => {
                  if (selectedIndex !== null) {
                    deleteImage(selectedIndex);
                    setPopupView(false);
                  }
                }}
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

export default HeroImageField;
