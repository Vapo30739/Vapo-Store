import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../api/axios.js";

const WelcomeSpinner = ({ motionBg, onDataFetched }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/settings");
        if (response.status === 200) {
          const settingsData = response.data.data[0] || {};
          sessionStorage.setItem("settings", JSON.stringify(settingsData));
          //   onDataFetched(); // Notify App that data is loaded
        }
      } catch (err) {
        console.error("Error fetching settings:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onDataFetched]);

  //   if (!loading) return null; // Hide spinner after loading

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 flex justify-center z-50"
      style={{
        backgroundImage: `url(${motionBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000",
      }}
    >
      <motion.div className="absolute inset-0 bg-black bg-opacity-80"></motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3 }}
        whileHover={{ scale: 1.05 }}
        className="relative h-screen flex items-center justify-center text-center px-4 mt-10"
      >
        <div className="text-white">
          <h1
            className="text-5xl md:text-7xl font-extrabold italic"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Vapo Abo Mariam
          </h1>

          <p className="text-lg md:text-2xl mt-4 uppercase tracking-widest">
            Smoking is a habit, vaping is a lifestyle
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeSpinner;
