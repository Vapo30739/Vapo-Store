import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategoryById, updateCategory } from "../../api/axios";
import { useParams } from "react-router-dom";
import SubCategoriesList from "../../components/SubCategoriesList";
import BackButton from "../../components/BackButton";
import Unauthorized from "../../components/Unauthorized";

const EditCategoryPage = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const token = localStorage.getItem("token");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [category, setCategory] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(id);
        reset({
          name: data.name || "",
          description: data.description || "",
        });
        setImagePreview(data.image);
        setCategory(data);
      } catch {
        setStatusMessage("Error fetching category.");
      }
    };

    fetchCategory();
  }, [refresh]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMessage("");

    try {
      const updatedCategory = await updateCategory(id, data, token);
      setStatusMessage("Category updated successfully!");
      setCategory(updatedCategory);
      setRefresh((prev) => !prev);
    } catch {
      setStatusMessage("Error updating category. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const clearImage = () => {
    setValue("image", null);
    clearErrors("image");
    setImagePreview(null);
  };

  if (!token) return <Unauthorized />;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative space-y-4 w-[90vw] mx-auto bg-transparent py-7"
      >
        <BackButton />

        <p className="text-center text-white font-bold">Edit Category</p>

        {/* Name Field */}

        <div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Name</label>
            <input
              dir="rtl"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="border rounded p-2 w-3/4 bg-red-100"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-red-500 font-bold text-center">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description Field */}

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

        {/* Image Upload */}

        <div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Image</label>
            <input
              type="file"
              {...register("image")}
              className="border rounded p-2 text-white text-sm inline-block w-3/4"
            />
            <button
              type="button"
              className="absolute right-1 bg-red-400 text-black p-1 rounded-full text-xs"
              onClick={clearImage}
            >
              Clear
            </button>
          </div>
          {imagePreview && (
            <div className="mt-4 w-full flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex mt-5">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-1 rounded mr-5"
            disabled={loading}
          >
            {loading ? "Loading..." : "Edit"}
          </button>
          {statusMessage && (
            <p className="text-red-500 font-bold text-center">
              {statusMessage}
            </p>
          )}
        </div>
      </form>

      {/* Image Preview */}

      <SubCategoriesList
        category={category}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default EditCategoryPage;
