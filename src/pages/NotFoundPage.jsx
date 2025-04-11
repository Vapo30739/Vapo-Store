import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className={"relative min-h-[100vh]"}>
      <div className="relative  w-[80vw] mx-auto bg-transparent py-7">
        <section className="text-center flex flex-col justify-center items-center h-96 text-white">
          <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
          <i className="fas fa-exclamation-triangle text-yellow-400 fa-4x mb-4"></i>
          <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
          <p className="text-xl mb-5">This page does not exist</p>
          <Link
            to="/"
            className="text-white bg-red-700 hover:bg-red-900 rounded-md px-3 py-2 mt-4"
          >
            Go Back
          </Link>
        </section>
      </div>
    </div>
  );
};

export default NotFoundPage;
