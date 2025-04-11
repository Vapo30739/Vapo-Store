import React from "react";
import { useForm } from "react-hook-form";
import { addFAQ } from "../../api/axios";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/BackButton";
import Unauthorized from "../../components/Unauthorized";
const AddNewFAQPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const token = localStorage.getItem("token");
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMessage("");

    try {
      await addFAQ(data, token);
      setStatusMessage("FAQ created successfully! Redirecting...");
      setTimeout(() => navigate("/faq"), 2000);
    } catch {
      setStatusMessage("Error creating FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const clearImage = () => {
    setValue("image", []);
    clearErrors("image");
  };

  if (!token) return <Unauthorized />;

  return (
    <div className="relative min-h-[100vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative space-y-4 w-[90vw] mx-auto bg-transparent py-7"
      >
        <BackButton />
        <p className="text-center text-white font-bold">FAQ Details</p>

        {/* Question */}
        <div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Question</label>
            <textarea
              dir="rtl"
              {...register("question", { required: "This field is required" })}
              className="border rounded p-2 w-3/4 bg-red-100 resize-none overflow-hidden"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            ></textarea>
          </div>
          {errors.question && (
            <p className="text-red-500 mt-2 text-center font-bold">
              {errors.question.message}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Answer</label>
            <textarea
              dir="rtl"
              {...register("answer", { required: "This field is required" })}
              className="border rounded p-2 w-3/4 bg-red-100 resize-none overflow-hidden"
              rows={2}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            ></textarea>
          </div>
          {errors.answer && (
            <p className="text-red-500 mt-2 text-center font-bold">
              {errors.answer.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4">Images</label>
            <input
              type="file"
              {...register("image")}
              multiple
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

          {/* Submit Button */}
          <div className="flex mt-5">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-1 rounded mr-5"
              disabled={loading}
            >
              {loading ? "Loading..." : "Add"}
            </button>
            {statusMessage && (
              <p className="text-red-500 font-bold">{statusMessage}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewFAQPage;
