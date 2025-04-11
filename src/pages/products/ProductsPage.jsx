import React, { useEffect, useState } from "react";
import {
  getCategoryById,
  getSubCategories,
  getProductsByCategory,
  getDiscountedProductsRequest,
} from "../../api/axios";
import { Link, useParams } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import Product from "../../components/products/Product";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";

const ProductsPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token") || "";
  const [filteredSubCategory, setFilteredSubCategory] = useState("");
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [discountedItems, setDiscountedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [offersCategory, setOffersCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryData, subCategories, items] = await Promise.all([
          getCategoryById(id),
          getSubCategories(),
          getProductsByCategory(id),
        ]);

        setCategoryDetails(categoryData);
        setOffersCategory(categoryData.name.includes("عروض"));

        setAllSubCategories(
          subCategories.filter(
            (subCategory) => subCategory.main_category_id?._id === id
          )
        );

        setItems(items);
        setFilteredItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!offersCategory) return;

    const fetchDiscountedProducts = async () => {
      setLoading(true);
      try {
        const items = await getDiscountedProductsRequest();
        setDiscountedItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, [offersCategory]);

  const handleFilterChange = (e) => {
    const selectedSubCategory = e.target.value;
    setFilteredSubCategory(selectedSubCategory);
    setFilteredItems(
      selectedSubCategory
        ? items.filter(
            (item) => item.sub_category_id?._id === selectedSubCategory
          )
        : items
    );
  };

  const displayedItems = [
    ...new Map(
      [...filteredItems, ...discountedItems].map((item) => [item._id, item])
    ).values(),
  ];

  return (
    <div className="relative min-h-[100vh]">
      <div className="relative w-[90vw] mx-auto bg-transparent py-7">
        <BackButton />

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div dir="rtl" className="mb-10">
              <p className="text-white text-lg">{categoryDetails?.name}</p>
              <p className="text-gray-500">{categoryDetails?.description}</p>
            </div>

            <div className="flex flex-row-reverse justify-between items-center mb-5 px-2 text-xs">
              {!offersCategory && (
                <select
                  onChange={handleFilterChange}
                  className="border rounded p-2 bg-red-100 text-right"
                  dir="rtl"
                >
                  <option value="">الكل</option>
                  {allSubCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              )}
              {token && (
                <Link to="/add-product">
                  <CiCirclePlus
                    size={30}
                    color="white"
                    className="g-gray-200"
                  />
                </Link>
              )}
            </div>

            <section className="py-5 font-bold">
              {displayedItems.length > 0 ? (
                <div
                  dir="rtl"
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"
                >
                  {displayedItems.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-lg text-white">لا يوجد عناصر للعرض</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
