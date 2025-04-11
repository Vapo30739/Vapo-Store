import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../api/axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Unauthorized from "../../components/Unauthorized";
import ImageField from "../../components/ImageField";
import BulkImageUploadForm from "../../components/BulkImageUploadForm";
import BackButton from "../../components/BackButton";
import {
  getCategories,
  getProductDetails,
  updateProduct,
  getSubCategories,
} from "../../api/axios";
import { Switch } from "@radix-ui/react-switch";
const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [allCategories, setAllCategories] = useState([]);

  const [productDetails, setProductDetails] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(() => {
    setLoadingCategories(true);

    const fetchData = async () => {
      try {
        const categories = await getCategories();
        setAllCategories(categories);

        const response2 = await getSubCategories();

        setAllSubCategories(response2);
        setFilteredSubCategories(response2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProductDetails(id);
        setProductDetails(productData);

        reset({
          name: productData.name || "",
          price: productData.price || "",
          discount: productData.discount || "",
          description: productData.description || "",
          main_category_id: productData.main_category_id?._id || "",
          sub_category_id: productData.sub_category_id?._id || "",
          is_hidden: productData.is_hidden || false,
        });

        setSelectedCategoryId(productData.main_category_id?._id || "");

        const filtered = allSubCategories.filter(
          (subCategory) =>
            subCategory.main_category_id &&
            subCategory.main_category_id._id ===
              productData.main_category_id?._id
        );
        setFilteredSubCategories(filtered);

        reset((prevData) => ({
          ...prevData,
          sub_category_id: productData.sub_category_id?._id || "",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset, allSubCategories, setFilteredSubCategories]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMessage("");

    try {
      await updateProduct(id, data, token);
      setStatusMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating Product:", error);
      setStatusMessage("Failed to update Product.");
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategoryId(selectedCategoryId);

    const filtered = allSubCategories.filter(
      (subCategory) =>
        subCategory.main_category_id &&
        subCategory.main_category_id._id === selectedCategoryId
    );

    setFilteredSubCategories(filtered);

    reset((prevValues) => ({
      ...prevValues,
      main_category_id: selectedCategoryId,
      sub_category_id: "",
    }));
  };

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = allSubCategories.filter(
        (subCategory) =>
          subCategory.main_category_id &&
          subCategory.main_category_id._id === selectedCategoryId
      );
      setFilteredSubCategories(filtered);
    }
  }, [selectedCategoryId, allSubCategories]);

  if (!token) return <Unauthorized />;
  return (
    <>
      <div className={"relative min-h-[100vh]"}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative space-y-4 w-[90vw] mx-auto bg-transparent py-7"
        >
          <BackButton />
          <p className="text-center text-white font-bold">
            New Product Details
          </p>
          <div>
            <div className="flex items-center">
              <label className="text-white font-bold w-1/4 text-sm">Name</label>
              <textarea
                dir="rtl"
                {...register("name", { required: "Name is required" })}
                className="border rounded p-2 w-3/4 bg-red-100 resize-none overflow-hidden"
                rows={1}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              ></textarea>
            </div>{" "}
            {errors.name && (
              <p className="mt-2 text-red-500 font-bold text-center">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4 text-sm">
              Description
            </label>
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
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4 text-sm">Price</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="border rounded p-2 w-3/4 bg-red-100"
            />
          </div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4 text-sm">
              Discount
            </label>
            <input
              type="number"
              step="0.01"
              {...register("discount")}
              className="border rounded p-2 w-3/4 bg-red-100"
            />
          </div>
          <div className="flex flex-col">
            {loadingCategories ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <>
                <div className="flex mb-4">
                  <label className="text-white font-bold w-1/4 text-sm">
                    Category
                  </label>
                  <div className="flex items-center">
                    <select
                      {...register("main_category_id")}
                      className="border rounded p-2 w-full bg-red-100 text-right w-3/4"
                      onChange={handleCategoryChange}
                      value={selectedCategoryId}
                    >
                      <option className="text-left" value="">
                        Select a category
                      </option>
                      {allCategories.map((category) => (
                        <option
                          className="inline-block flex justify-between"
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-end w-1/4 ml-5 space-x-2">
                      <Link
                        className="bg-green-500 text-white p-1 rounded-full text-xs"
                        to={"/add-category"}
                      >
                        Add
                      </Link>
                      <button
                        type="button"
                        className="bg-red-500 text-white p-1 rounded-full text-xs"
                        onClick={() => {
                          navigate(`/edit-category/${selectedCategoryId}`);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="text-white font-bold w-1/4 text-sm break-all">
                    SubCategory
                  </label>
                  <div className="flex items-center w-3/4">
                    {selectedCategoryId ? (
                      filteredSubCategories.length > 0 ? (
                        <select
                          dir="rtl"
                          {...register("sub_category_id")}
                          className="border rounded p-2 bg-red-100 text-right w-full"
                        >
                          <option className="text-left" value="">
                            Select a Subcategory
                          </option>
                          {filteredSubCategories.map((subCategory) => (
                            <option
                              className="inline-block flex justify-between"
                              key={subCategory._id}
                              value={subCategory._id}
                            >
                              {subCategory.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="ml-2 text-red-600 font-bold">
                          There are no subcategories for this category yet.
                        </p>
                      )
                    ) : (
                      <p className="ml-2 text-red-600 font-bold">
                        Please select a main category first.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div>
            <div className="flex items-center my-5">
              <label className="text-white font-bold w-1/4 text-sm">
                Hide Product
              </label>
              <div className="w-3/4 flex items-center">
                <Switch
                  checked={watch("is_hidden", false)}
                  onCheckedChange={(value) => setValue("is_hidden", value)}
                  className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${
                    watch("is_hidden") ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                      watch("is_hidden") ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </Switch>
              </div>
            </div>
          </div>
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

        <div className="relative w-[90vw] mx-auto py-5">
          {!loading && productDetails?.images && (
            <BulkImageUploadForm
              inputDetails={productDetails}
              endpoint={"item"}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
        </div>
        <div className="relative w-[80vw] mx-auto py-5">
          {!loading && productDetails?.images && (
            <ImageField
              inputDetails={productDetails}
              endpoint={"item"}
              name={"Product"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditProductPage;
