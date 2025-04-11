import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getFAQById, updateFAQ } from "../../api/axios";

import { useNavigate, useParams } from "react-router-dom";
import Unauthorized from "../../components/Unauthorized";
import ImageField from "../../components/ImageField";
import BulkImageUploadForm from "../../components/BulkImageUploadForm";
import BackButton from "../../components/BackButton";

const EditFAQPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [faqDetails, setFaqDetails] = useState({});

  useEffect(() => {
    setLoading(true);

    const fetchFAQ = async () => {
      try {
        const data = await getFAQById(id);
        setFaqDetails(data);
        reset({
          question: data.question || "",
          answer: data.answer || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [refresh, id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMessage("");

    try {
      await updateFAQ(id, data);
      setStatusMessage("FAQ edited successfully!");
    } catch (error) {
      setStatusMessage("Error editing FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
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
              rows={1}
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

        {/* Submit Button */}
        <div>
          <div className="flex mt-5">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-1 rounded mr-5"
              disabled={loading}
            >
              {loading ? "Loading..." : "Edit"}
            </button>
            {statusMessage && (
              <p className="text-red-500 font-bold">{statusMessage}</p>
            )}
          </div>
        </div>
      </form>

      {/* Bulk Image Upload */}
      <div className="relative w-[80vw] mx-auto py-5">
        {!loading && faqDetails?.images && (
          <BulkImageUploadForm
            inputDetails={faqDetails}
            endpoint="faq"
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
      </div>

      {/* Image Field */}
      <div className="relative w-[80vw] mx-auto py-5">
        {!loading && faqDetails?.images && (
          <ImageField inputDetails={faqDetails} endpoint="faq" name="FAQ" />
        )}
      </div>
    </div>
  );
};

export default EditFAQPage;
