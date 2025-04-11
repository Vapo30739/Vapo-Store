import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createProduct,
  getCategories,
  getSubCategories,
} from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Switch } from "@radix-ui/react-switch";
import BackButton from "../../components/BackButton";
import Unauthorized from "../../components/Unauthorized";
const AddNewProduct = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hidden: false,
    },
  });
  const token = localStorage.getItem("token");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await createProduct(data, token);

      if (response.status === 201) {
        setStatusMessage("Product created successfully!, Redirecting...");
        console.log(response);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setStatusMessage("Failed to create the product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setStatusMessage("Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
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

  const clearImage = () => {
    setValue("image", null);
    clearErrors("image");
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
  };

  if (!token) return <Unauthorized />;

  return (
    <>
      <div className="relative min-h-[100vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative space-y-4 w-[90vw] mx-auto bg-transparent py-7"
        >
          <BackButton />
          <p className="text-center text-white font-bold">
            New Product Details
          </p>

          <div>
            {" "}
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
            </div>
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
              dir="rtl"
              type="number"
              step="0.01"
              {...register(
                "price"
                // , { required: "Price is required" }
              )}
              className="border rounded p-2 w-3/4 bg-red-100"
            />
            {/* {errors.price && (
              <p className="mt-2 text-red-500 font-bold text-center">
                {errors.price.message}
              </p>
            )} */}
          </div>
          <div className="flex items-center">
            <label className="text-white font-bold w-1/4 text-sm">
              Discount
            </label>
            <input
              dir="rtl"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("discount", {
                min: { value: 0, message: "Discount cannot be less than 0" },
                max: {
                  value: 100,
                  message: "Discount cannot be more than 100",
                },
              })}
              className="border rounded p-2 w-3/4 bg-red-100"
            />
          </div>
          <div className="flex flex-col">
            {loadingCategories ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <>
                <div>
                  <div className="flex items-center mb-4">
                    <label className="text-white font-bold w-1/4 text-sm">
                      Category
                    </label>
                    <div className="flex items-center">
                      <select
                        dir="rtl"
                        {...register("main_category_id", {
                          required: "Category is required",
                        })}
                        className="border rounded p-2 w-full bg-red-100 text-right w-3/4"
                        onChange={handleCategoryChange}
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
                  </div>{" "}
                  {errors.main_category_id && (
                    <p className="mt-2 text-red-500 font-bold text-center">
                      {errors.main_category_id.message}
                    </p>
                  )}
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
                  checked={watch("hidden", false)}
                  onCheckedChange={(value) => setValue("hidden", value)}
                  className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${
                    watch("hidden") ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                      watch("hidden") ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </Switch>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div className="flex items-center">
                <label className="text-white font-bold w-1/4 text-sm">
                  Images
                </label>
                <input
                  type="file"
                  {...register("image", {
                    required: "At least one image is required",
                  })}
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
              {errors.image && (
                <p className="mt-2 text-red-500 font-bold text-center">
                  {errors.image.message}
                </p>
              )}
            </div>
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
      </div>
    </>
  );
};

export default AddNewProduct;
