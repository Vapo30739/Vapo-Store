import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductDetails } from "../../api/axios";
import Spinner from "../../components/Spinner";

import BackButton from "../../components/BackButton";
import { AiOutlineClose } from "react-icons/ai";
const ProductPage = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [mainImage, setMainImage] = useState("");
  const storedDollarValue = sessionStorage.getItem("dollar_value") || 1;
  const [popupView, setPopupView] = useState(false);

  const [whatsappAccounts, setWhatsappAccounts] = useState([]);
  useEffect(() => {
    const storedSettings = sessionStorage.getItem("settings");

    if (storedSettings) {
      const settingsObject = JSON.parse(storedSettings);
      setWhatsappAccounts(settingsObject.social_media.whatsapp);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await getProductDetails(id);

        setProductDetails(response);
        if (response.images?.length) {
          setMainImage(response.images[0]);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="relative min-h-[100vh]">
        <div className="relative w-[80vw] mx-auto bg-transparent py-7 text-white">
          <BackButton />

          {loading ? (
            <Spinner />
          ) : productDetails ? (
            <>
              <div className="w-full">
                <div className="w-full flex justify-center items-center mb-5">
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="rounded w-[350px] h-[350px] object-contain"
                  />
                </div>

                {productDetails.images?.length > 1 && (
                  <div
                    dir="rtl"
                    className="flex w-full justify-center items-center mb-5 flex-wrap"
                  >
                    {productDetails.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        className="rounded-full w-10 h-10 mx-1 cursor-pointer object-cover"
                        onClick={() => setMainImage(image)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div
                dir="rtl"
                className="bg-transparent text-white p-5 rounded-lg shadow-lg max-w-lg mx-auto"
              >
                <h2 className="text-xl font-bold mb-4 whitespace-pre-wrap leading-relaxed">
                  {productDetails.name}
                </h2>

                {productDetails.description && (
                  <p className="mb-4 text-gray-300 whitespace-pre-wrap leading-relaxed">
                    <span className="font-bold text-lg mb-2 block">الوصف:</span>
                    {productDetails.description}
                  </p>
                )}
                {productDetails.price && (
                  <div className="mb-6">
                    <p className="font-bold text-lg mb-2">السعر:</p>
                    {productDetails.discount ? (
                      <div className="flex flex-col items-start gap-2">
                        <span className="flex items-center text-gray-400 text-sm line-through">
                          السعر الأصلي: ${productDetails.price}
                        </span>

                        <span className="flex items-center text-green-400 text-xl font-bold">
                          السعر بعد الخصم: $
                          {(
                            productDetails.price *
                            (1 - productDetails.discount / 100)
                          ).toFixed(2)}
                        </span>

                        <span className="text-sm text-gray-300">
                          ما يعادل:
                          {(
                            productDetails.price *
                            storedDollarValue *
                            (1 - productDetails.discount / 100)
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                          ل.س
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <span className="text-gray-300 text-xl font-bold">
                          ${productDetails.price}
                        </span>
                        <span className="text-sm text-gray-300">
                          ما يعادل:
                          {(
                            productDetails.price * storedDollarValue
                          ).toLocaleString("en-US")}
                          ل.س
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-bold text-lg mb-2">الصنف:</p>
                  {productDetails.main_category_id && (
                    <span className="inline-block bg-red-600 text-gray-200 text-sm px-3 py-1 rounded-full">
                      {productDetails.main_category_id.name}
                    </span>
                  )}
                  {productDetails.sub_category_id && (
                    <span className="inline-block bg-red-600 text-gray-200 text-sm px-3 py-1 rounded-full">
                      {productDetails.sub_category_id.name}
                    </span>
                  )}
                </div>
                {token && (
                  <div dir="rtl" className="my-2">
                    {" "}
                    <Link
                      className=" p-1 text-center bg-gray-500 hover:bg-gray-600 transition  text-white font-bold py-2 rounded-lg cursor-pointer"
                      to={`/edit-product/${productDetails._id}`}
                    >
                      تعديل المنتج
                    </Link>
                  </div>
                )}
                <a
                  onClick={() => setPopupView(true)}
                  className="block text-center bg-red-500 hover:bg-red-600 transition duration-200 text-white font-bold py-2 rounded-lg cursor-pointer"
                >
                  أطلب الآن
                </a>
              </div>
            </>
          ) : (
            <p>لا يوجد معلومات للمنتج</p>
          )}
        </div>
      </div>

      {popupView && (
        <div
          className="min-h-screen w-full bg-black z-10 fixed top-0 left-0 bg-opacity-70"
          onClick={() => setPopupView(false)}
        >
          <button
            className="right-4 top-10 cursor-pointer p-3 text-white fixed rounded-full w-[40px] text-2xl"
            onClick={(e) => {
              setPopupView(false);
            }}
          >
            <AiOutlineClose />
          </button>

          <div className="flex items-center justify-center min-h-screen overflow-y-auto">
            <div
              dir="rtl"
              className="flex flex-col text-white bg-black p-6 rounded-lg w-[80vw] max-w-[600px] mx-auto my-10"
              onClick={(e) => e.stopPropagation()}
            >
              {whatsappAccounts.length !== 0 ? (
                <>
                  <p className="font-bold mb-5">أختر الادمن المناسب:</p>
                  <ul className="space-y-2 text-gray-400">
                    {whatsappAccounts.map((account, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-black bg-opacity-40 p-3 rounded"
                      >
                        <div>
                          <p className="font-bold">{account.name}</p>
                          <p className="text-sm">{account.phone_number}+</p>
                        </div>
                        <button className="bg-red-600 text-white py-1 px-2 rounded">
                          <a href={account.link}>تواصل من هنا</a>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>لا يوجد معلومات لعرضها</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
