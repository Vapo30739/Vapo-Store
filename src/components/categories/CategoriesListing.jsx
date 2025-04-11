import React, { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { getCategories } from "../../api/axios.js";
import Category from "./Category";

const CategoriesListing = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const removeCategory = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category._id !== categoryId)
    );
  };

  return (
    <section className="px-4 py-5 font-bold">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {categories.length === 0 ? (
            <p>There are no Categories to show</p>
          ) : (
            categories.map((category) => (
              <Category
                key={category._id}
                category={category}
                removeCategory={removeCategory}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default CategoriesListing;
