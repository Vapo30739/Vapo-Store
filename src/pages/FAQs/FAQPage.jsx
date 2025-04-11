import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFAQs } from "../../api/axios";
import Spinner from "../../components/Spinner";
import FAQ from "../../components/FAQ";
import { CiCirclePlus } from "react-icons/ci";
import BackButton from "../../components/BackButton";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const faqs = await getFAQs();
        setFaqs(faqs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-[100vh]">
      <div className="relative w-[80vw] mx-auto bg-transparent py-7 text-white">
        <BackButton />
        <div>
          {loading ? (
            <Spinner loading={loading} />
          ) : (
            <div>
              <div className="flex justify-between mb-5" dir="rtl">
                <p className="text-right text-2xl">الأسئلة الشائعة</p>
                <Link to={"/add-faq"}>
                  <CiCirclePlus
                    size={30}
                    color="white"
                    className="g-gray-200"
                  />
                </Link>
              </div>

              {faqs.length === 0 ? (
                <p>لا يوجد أسئلة شائعة للعرض</p>
              ) : (
                faqs.map((faq) => (
                  <FAQ
                    key={faq._id}
                    question={faq.question}
                    answer={faq.answer}
                    images={faq.images}
                    id={faq._id}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
