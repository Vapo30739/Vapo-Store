import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { deleteItem } from "../api/axios";
import { useForm } from "react-hook-form";
import {
  getSubCategoriesForSingleCategory,
  createSubCategory,
} from "../api/axios";
const SubcategoriesList = ({ refresh, setRefresh, category }) => {
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [popupView, setPopupView] = useState(false);
  const [selectedSub, setSelectedSub] = useState({});
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setStatusMessage("");
    setLoadingSubCategories(false);

    if (!category || Object.keys(category).length === 0) {
      setAllSubCategories([]);
      return;
    }

    setLoadingSubCategories(true);

    const getSubCategories = async () => {
      try {
        const data = await getSubCategoriesForSingleCategory(category._id);
        setAllSubCategories(data);

        if (data.length === 0) {
          setStatusMessage("There is no Subcategories yet for this category.");
        }
      } catch (error) {
        setStatusMessage(error.message);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    getSubCategories();
  }, [refresh, category]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await createSubCategory(data, category._id, token);

      if (response.status === 201) {
        setStatusMessage("SubCategory created successfully!");
        setRefresh((prev) => !prev);
      } else {
        setStatusMessage("Failed to create the SubCategory.");
      }
    } catch (error) {
      console.error("Error creating SubCategory:", error);
      setStatusMessage("Error creating SubCategory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!category || Object.keys(category).length === 0) {
    return <></>;
  }

  const deleteSubCategory = async (subId) => {
    try {
      await deleteItem("sub_category", subId, token);

      setPopupView(false);
      setAllSubCategories((prev) =>
        prev.filter((subCategory) => subCategory._id !== subId)
      );
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <>
      <div className="relative space-y-4 w-[90vw] mx-auto bg-transparent py-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative space-y-2 w-[80vw] mx-auto bg-transparent py-7 text-sm"
        >
          <p className="text-center text-white font-bold text-lg mb-5">
            New SubCategory Details
          </p>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Name</label>
            <input
              dir="rtl"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="border rounded p-2 w-3/4 bg-red-100"
            />
            {errors.name && (
              <p className="text-red-500 ml-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Description</label>
            <textarea
              dir="rtl"
              {...register("description")}
              className="border rounded p-2 w-3/4 bg-red-100 resize-none overflow-hidden"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            ></textarea>
          </div>

          <div>
            <div className="flex mt-5">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-1 rounded mr-5"
                disabled={loading}
              >
                {loading ? "Loading..." : "Create"}
              </button>
              {statusMessage && (
                <p className="text-red-500 font-bold">{statusMessage}</p>
              )}
            </div>
          </div>
        </form>
        {/* <p className="text-white bg-black ">{statusMessage && statusMessage}</p> */}
        <ul className="space-y-2 text-sm  w-[70vw] mx-auto">
          {allSubCategories.length > 0 &&
            allSubCategories.map((subCategory, subId) => (
              <li
                key={subId}
                className="flex items-center justify-between bg-black bg-opacity-40 p-3 rounded"
              >
                <div className="text-white rounded-lg">
                  <p className="font-bold">{subCategory.name}</p>
                  <p className="text-sm">{subCategory.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSub(subCategory);

                    setPopupView(true);
                  }}
                  className="bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
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
              هل أنت متأكد من حذف القسم الفرعي{" "}
              <span className="font-bold">"{selectedSub.name}"</span>؟
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => deleteSubCategory(selectedSub._id)}
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

export default SubcategoriesList;
