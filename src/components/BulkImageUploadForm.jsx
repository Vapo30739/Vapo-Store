import React, { useState } from "react";
import { uploadImages } from "../api/axios";
const ImageUploadForm = ({ inputDetails, endpoint, refresh, setRefresh }) => {
  const [images, setImages] = useState([]);
  const [key, setKey] = useState(Date.now());
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setImages(selectedFiles);
    setStatusMessage("");
  };
  const token = localStorage.getItem("token");
  const clearImages = () => {
    setImages([]);
    setKey(Date.now());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (images.length === 0) {
      setStatusMessage("Please select at least one image to upload.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await uploadImages(
        endpoint,
        inputDetails._id,
        images,
        token
      );

      if (response.status === 201) {
        setStatusMessage("Images uploaded successfully!");
        setImages([]);
        setKey(Date.now()); // Reset the input field
        setTimeout(() => setRefresh((prev) => !prev), 100);
      } else {
        setStatusMessage("Failed to upload images. Please try again.");
      }
    } catch (error) {
      setStatusMessage("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center">
        <label className="text-white font-bold w-1/4">Add New Images</label>
        <input
          key={key} // Unique key to force re-render
          type="file"
          multiple
          className="border rounded p-2 text-white text-sm inline-block w-3/4"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="absolute right-1 ml-2 bg-red-400 text-black p-1 rounded-full text-xs"
          onClick={clearImages}
        >
          Clear
        </button>
      </div>
      <div className="flex items-center">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-1 rounded mr-5"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {statusMessage && (
          <p className="text-red-500 font-bold">{statusMessage}</p>
        )}
      </div>
    </form>
  );
};

export default ImageUploadForm;
