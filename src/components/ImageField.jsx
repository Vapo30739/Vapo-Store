import React, { useEffect, useState } from "react";
import { deleteImageRequest, editImageRequest } from "../api/axios";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ImageField = ({ inputDetails, endpoint, name }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [popupView, setPopupView] = useState(false);
  const [imagePreviews, setImagePreviews] = useState(
    inputDetails?.images || []
  );
  const [inputKeys, setInputKeys] = useState(
    (inputDetails?.images || []).map(() => Date.now())
  );
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (inputDetails?.images) {
      setImagePreviews([...inputDetails.images]);
      setInputKeys(inputDetails.images.map(() => Date.now()));
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
      updated[index] = inputDetails?.images?.[index] || null;
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
      await deleteImageRequest(endpoint, inputDetails._id, index, token);

      setImagePreviews((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });

      alert(`Image ${index + 1} deleted successfully`);
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert(`Failed to delete image ${index + 1} . Please try again.`);
    }
  };

  const editImage = async (index) => {
    const updatedFile = imagePreviews[index];

    if (!(updatedFile instanceof File)) {
      alert("Please select a new file to update.");
      return;
    }

    try {
      await editImageRequest(
        endpoint,
        inputDetails._id,
        index,
        updatedFile,
        token
      );

      alert(`Image ${index + 1} updated successfully.`);
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert(`Failed to edit image ${index + 1} . Please try again.`);
    }
  };

  const setExpand = () => {
    setVisible(!visible);
  };

  if (imagePreviews.length === 0) {
    return (
      <>
        <p className="w-100 text-md text-white font-bold mb-3">
          Current Images
        </p>
        <p className="w-100 text-sm text-gray-400 font-bold">
          This {name} has no Images!
        </p>
      </>
    );
  }

  return (
    <>
      {" "}
      <div className="p-5 bg-transparent border-2 border text-white rounded-lg">
        {/* Toggle Button */}
        <div
          onClick={setExpand}
          className="flex justify-between items-center cursor-pointer rounded"
        >
          <h2 className="text-md font-bold">Current Images</h2>
          {visible ? (
            <FaChevronUp className="text-white" />
          ) : (
            <FaChevronDown className="text-white" />
          )}
        </div>

        {/* Expanding Section */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            visible ? "max-h-[100000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          {imagePreviews.map((image, index) => (
            <div key={index} className=" px-3 py-2 mb-5">
              <div className="flex items-center mb-3">
                <label className="text-white w-1/4">Image {index + 1}</label>
                <input
                  key={inputKeys[index]}
                  type="file"
                  className="border rounded p-2 w-3/4 text-white text-sm"
                  onChange={(event) => handleFileChange(event, index)}
                />
                <button
                  type="button"
                  onClick={() => clearImage(index)}
                  className="ml-2 bg-red-400 text-black p-1 rounded-full text-xs"
                >
                  Clear
                </button>
              </div>

              {image && (
                <div className="flex justify-center items-center my-3">
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
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index);
                    setPopupView(true);
                  }}
                  className="flex bg-red-400 text-black p-1 rounded text-xs items-center"
                >
                  Delete
                  <MdDelete className="ml-1" size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => editImage(index)}
                  className="flex bg-green-400 text-black p-1 rounded text-xs items-center"
                >
                  Edit
                  <FaEdit className="ml-1" size={20} />
                </button>
              </div>
            </div>
          ))}
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

export default ImageField;
