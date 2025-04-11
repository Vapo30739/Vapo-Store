import React, { useEffect, useState } from "react";
import Product from "./Product";
import Spinner from "../Spinner";
import { getProducts } from "../../api/axios.js";

const ProductsListing = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const filteredItems = Array.isArray(items)
    ? items.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  return (
    <section className="px-4 py-5 font-bold">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <>
          <div className="mb-4">
            <input
              dir="rtl"
              type="text"
              placeholder="ابحث عن منتج..."
              className="w-full p-2 border border-gray-300 rounded-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {filteredItems.length === 0 ? (
              <p className="text-white">لا يوجد عناصر مطابقة للبحث</p>
            ) : (
              filteredItems
                .slice(0, visibleCount)
                .map((product, index) => (
                  <Product key={index} product={product} />
                ))
            )}
          </div>

          {visibleCount < filteredItems.length && (
            <div className="text-center mt-4">
              <button
                className="bg-red-800 text-white px-4 py-2 rounded active:bg-black"
                onClick={handleLoadMore}
              >
                عرض المزيد
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductsListing;
